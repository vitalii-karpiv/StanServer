import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserModule } from "../user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard } from "./auth.guard";
import TokenService from "./token.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RefreshToken } from "./model/refresh-token.model";

@Module({
  imports: [UserModule, JwtModule.register({ global: true }), TypeOrmModule.forFeature([RefreshToken])],
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AuthModule {}
