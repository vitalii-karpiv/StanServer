import { IsEmail, IsString } from "class-validator";

export default class LoginDtoIn {
  @IsString()
  @IsEmail()
  email: string;
  @IsString()
  password: string;
}
