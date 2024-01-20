import { UserRole } from "../../enum/UserRole";
import { ObjectId } from "typeorm";

export class GetUserDtoOut {
  _id: ObjectId;
  fullName: string;
  email: string;
  password: string;
  phone: string;
  photo: Buffer;
  role: UserRole;
  orders: string[];
  preferences_theme: string;
  preferences_notifications: boolean;
}
