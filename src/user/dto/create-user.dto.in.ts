import { IsString, IsArray, IsOptional, IsBoolean, IsEnum, IsEmail } from "class-validator";
import { UserRole } from "../../enum/UserRole";

export class CreateUserDtoIn {
  constructor(fullName: string, email: string, password: string, phone: string, role: UserRole) {
    this.fullName = fullName;
    this.email = email;
    this.password = password;
    this.phone = phone;
    this.role = role;
  }

  @IsString()
  fullName: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  phone: string;

  @IsOptional()
  photo: Buffer;

  @IsEnum(UserRole)
  @IsString()
  role: UserRole;

  @IsArray()
  @IsOptional()
  orders: string[];

  @IsString()
  @IsOptional()
  preferences_theme: string;

  @IsBoolean()
  @IsOptional()
  preferences_notifications: boolean;
}
