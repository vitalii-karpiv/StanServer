import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "../user/user.service";
import LoginDtoIn from "./dto/login.dto.in";
import { JwtService } from "@nestjs/jwt";
import LoginDtoOut from "./dto/login.dto.out";
import RegisterDtoIn from "./dto/register.dto.in";
import { CreateUserDtoIn } from "../user/dto/create-user.dto.in";
import { UserRole } from "../enum/UserRole";
import RegisterDtoOut from "./dto/register.dto.out";
import LogoutDtoIn from "./dto/logout.dto.in";
import RefreshDtoIn from "./dto/refresh.dto.in";
import TokenService from "./token.service";
import RefreshDtoOut from "./dto/refresh.dto.out";

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwtService: JwtService, private tokenService: TokenService) {}

  async login({ email, password }: LoginDtoIn) {
    // Retrieve user.
    const user = await this.userService.getByEmail(email);
    // Check if password correct.
    if (user.password !== password) {
      throw new UnauthorizedException();
    }
    // Generate JWT
    const { accessToken, refreshToken } = await this.tokenService.generateTokens(user._id, email);
    // Save refreshToken
    await this.tokenService.saveToken(user._id, refreshToken);
    // Return dtoOut
    return new LoginDtoOut(accessToken, refreshToken);
  }

  async register({ email, password, phone, fullName }: RegisterDtoIn) {
    // Check if user with given email does not already exists
    const duplicateUser = await this.userService.getByEmail(email);
    if (duplicateUser) {
      throw new BadRequestException({
        statusCode: 400,
        message: "User with given email already exists.",
        paramMap: {
          email,
        },
      });
    }
    // Create user
    const result = await this.userService.create(
      new CreateUserDtoIn(fullName, email, password, phone, UserRole.reader),
    );
    const userId = result._id;
    // TODO: Remove this step when create/update dtoOuts
    const user = await this.userService.get(userId);
    // Generate JWT
    const { accessToken, refreshToken } = await this.tokenService.generateTokens(user._id, email);
    // Save refresh token
    await this.tokenService.saveToken(user._id, refreshToken);
    // Return DtoOut
    return new RegisterDtoOut(accessToken, refreshToken);
  }

  async logout({ refreshToken }: LogoutDtoIn) {
    // Remove refresh from db
    await this.tokenService.removeToken(refreshToken);
  }

  async refresh({ refreshToken }: RefreshDtoIn) {
    // Validate refresh token
    const userData = await this.tokenService.validateRefreshToken(refreshToken);
    const token = await this.tokenService.findToken(refreshToken);

    if (!userData || !token) {
      throw new UnauthorizedException({
        statusCode: 401,
        message: "Refresh token does not exist.",
      });
    }

    const user = await this.userService.get(userData._id);

    // Generate tokens
    const { accessToken, refreshToken: newRefreshToken } = await this.tokenService.generateTokens(user._id, user.email);
    // Store tokens
    await this.tokenService.saveToken(user._id, newRefreshToken);
    // Return dtoOut
    return new RefreshDtoOut(accessToken, newRefreshToken);
  }
}
