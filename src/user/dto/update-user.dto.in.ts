import { IsString, IsNumber, IsArray, IsOptional, IsPositive, IsBoolean, IsEnum, IsEmail } from "class-validator";
import { UserRole } from "../../enum/UserRole";
import { ObjectId } from "typeorm";

export class UpdateUserDtoIn {
  @IsNumber()
  @IsPositive()
  _id: ObjectId;

  @IsString()
  @IsOptional()
  fullName: string;

  @IsString()
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  password: string;

  @IsString()
  @IsOptional()
  phone: string;

  @IsOptional()
  photo: Buffer;

  @IsOptional()
  @IsString()
  @IsEnum(UserRole)
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
