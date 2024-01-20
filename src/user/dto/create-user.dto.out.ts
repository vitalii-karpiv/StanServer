import { ObjectId } from "typeorm";

export class CreateUserDtoOut {
  constructor(_id: ObjectId) {
    this._id = _id;
  }
  _id: ObjectId;
}
