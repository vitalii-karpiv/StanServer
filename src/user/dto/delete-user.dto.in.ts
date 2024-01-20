import { IsNumber, IsPositive } from "class-validator";
import { ObjectId } from "typeorm";

export class DeleteUserDtoIn {
  @IsNumber()
  @IsPositive()
  _id: ObjectId;
}
