import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./model/user.model";
import { RefreshToken } from "../auth/model/refresh-token.model";

@Module({
  imports: [TypeOrmModule.forFeature([User, RefreshToken])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
