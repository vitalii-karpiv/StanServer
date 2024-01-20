import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { ObjectId, Repository } from "typeorm";
import { RefreshToken } from "./model/refresh-token.model";
import { UnauthorizedException } from "@nestjs/common";

export default class TokenService {
  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async generateTokens(userId: ObjectId, email: string) {
    const jwtPayload = {
      sub: userId,
      email: email,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>("ACCESS_TOKEN_SECRET"),
        expiresIn: "15m",
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>("REFRESH_TOKEN_SECRET"),
        expiresIn: "60d",
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateAccessToken(token: string) {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: this.config.get<string>("ACCESS_TOKEN_SECRET"),
      });
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  async validateRefreshToken(token: string) {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: this.config.get<string>("REFRESH_TOKEN_SECRET"),
      });
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  async saveToken(userId: ObjectId, refreshToken: string) {
    let tokenData: { user: ObjectId; token: string } = await this.refreshTokenRepository.findOne({
      where: { user: userId },
    });

    if (!tokenData) {
      tokenData = {
        user: userId,
        token: refreshToken,
      }; //new RefreshToken(null, userId, null);
    }
    tokenData.user = userId;
    tokenData.token = refreshToken;
    return await this.refreshTokenRepository.save({ ...tokenData });
  }

  async removeToken(refreshToken: string) {
    await this.refreshTokenRepository.delete({ token: refreshToken });
  }

  async findToken(refreshToken: string) {
    return await this.refreshTokenRepository.findOne({ where: { token: refreshToken } });
  }
}
