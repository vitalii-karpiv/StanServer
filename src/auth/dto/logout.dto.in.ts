import { IsOptional, IsString } from "class-validator";

export default class LogoutDtoIn {
  @IsString()
  @IsOptional()
  refreshToken: string;
}
