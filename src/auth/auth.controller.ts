import { Body, Controller, Get, HttpCode, HttpStatus, Post, Response, Request } from "@nestjs/common";
import { AuthService } from "./auth.service";
import LoginDtoIn from "./dto/login.dto.in";
import { ValidationPipe } from "../utils/validation.pipe";
import { Public } from "../utils/public-decorator";
import RegisterDtoIn from "./dto/register.dto.in";
import RefreshDtoIn from "./dto/refresh.dto.in";
import LogoutDtoIn from "./dto/logout.dto.in";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post("login")
  @Public()
  async login(@Body(new ValidationPipe()) loginDto: LoginDtoIn, @Response() response) {
    const loginDtoOut = await this.authService.login(loginDto);
    response.cookie("refreshToken", loginDtoOut.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      httpOnly: true,
    });
    response.send(loginDtoOut);
  }

  @HttpCode(HttpStatus.OK)
  @Post("register")
  @Public()
  async register(@Body(new ValidationPipe()) registerDto: RegisterDtoIn, @Response() response) {
    const registerDtoOut = await this.authService.register(registerDto);
    response.cookie("refreshToken", registerDtoOut.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      httpOnly: true,
    });
    response.send(registerDtoOut);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post("logout")
  async logout(@Request() request, @Body(new ValidationPipe()) logoutDto: LogoutDtoIn, @Response() response) {
    const { refreshToken } = request.cookies;
    if (!logoutDto.refreshToken) {
      logoutDto.refreshToken = refreshToken;
    }
    await this.authService.logout(logoutDto);
    response.clearCookie("refreshToken");
    response.send();
  }

  @HttpCode(HttpStatus.OK)
  @Get("refresh")
  @Public()
  async refresh(@Request() request, @Body(new ValidationPipe()) refreshDto: RefreshDtoIn, @Response() response) {
    const { refreshToken } = request.cookies;
    if (!refreshDto.refreshToken) {
      refreshDto.refreshToken = refreshToken;
    }
    const refreshDtoOut = await this.authService.refresh(refreshDto);
    response.cookie("refreshToken", refreshDtoOut.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      httpOnly: true,
    });
    response.send(refreshDtoOut);
  }
}
