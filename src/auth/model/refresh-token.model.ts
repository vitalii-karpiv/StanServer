import { Column, Entity, JoinColumn, ObjectId, ObjectIdColumn, OneToOne } from "typeorm";
import { User } from "../../user/model/user.model";

@Entity()
export class RefreshToken {
  constructor(_id: ObjectId, userId: ObjectId, token: string) {
    this._id = _id;
    this.user = userId;
    this.token = token;
  }
  @ObjectIdColumn()
  _id: ObjectId;

  @OneToOne(() => User)
  @JoinColumn()
  user: ObjectId;

  @Column()
  token: string;
}
