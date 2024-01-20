import { IsOptional, IsString } from "class-validator";

export default class RefreshDtoIn {
  @IsString()
  @IsOptional()
  refreshToken: string;
}
