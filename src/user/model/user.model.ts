import { UserRole } from "../../enum/UserRole";
import { Entity, Column, ObjectIdColumn, ObjectId } from "typeorm";

@Entity("users")
export class User {
  constructor(
    fullName: string,
    email: string,
    password: string,
    phone: string,
    photo: Buffer,
    role: UserRole,
    orders: string[],
    preferences_theme: string,
    preferences_notifications: boolean,
  ) {
    this.fullName = fullName;
    this.email = email;
    this.password = password;
    this.phone = phone;
    this.photo = photo;
    this.role = role;
    this.orders = orders;
    this.preferences_theme = preferences_theme;
    this.preferences_notifications = preferences_notifications;
  }

  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  fullName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  phone: string;

  @Column({ type: "bytea", nullable: true }) // Use 'bytea' type for binary data
  photo: Buffer;

  @Column({ nullable: true })
  role: UserRole;

  @Column("text", { array: true, nullable: true })
  orders: string[];

  @Column({ nullable: true })
  preferences_theme: string;

  @Column({ nullable: true })
  preferences_notifications: boolean;
}
