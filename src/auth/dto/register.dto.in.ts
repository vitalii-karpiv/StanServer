import { IsEmail, IsPhoneNumber, IsString } from "class-validator";

export default class RegisterDtoIn {
  @IsString()
  @IsEmail()
  email: string;
  @IsString()
  password: string;
  @IsString()
  fullName: string;
  @IsString()
  @IsPhoneNumber("UA")
  phone: string;
}
