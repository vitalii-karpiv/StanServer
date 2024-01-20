import { Module } from "@nestjs/common";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { APP_PIPE } from "@nestjs/core";
import { ValidationPipe } from "./utils/validation.pipe";
import { UserModule } from "./user/user.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import * as process from "process";
import { User } from "./user/model/user.model";
import { AuthModule } from "./auth/auth.module";
import { RefreshToken } from "./auth/model/refresh-token.model";

@Module({
  imports: [
    UserModule,
    AuthModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: config.get<string>("DATABASE_TYPE"),
          url: config.get<string>("CONNECT_URL"),
          entities: [User, RefreshToken],
          synchronize: false,
          useNewUrlParser: true,
          logging: true,
        } as unknown as TypeOrmModuleOptions;
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `env/.env.${process.env.NODE_ENV}`,
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
