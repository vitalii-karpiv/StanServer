import { ObjectId } from "typeorm";

export class UpdateUserDtoOut {
  constructor(_id: ObjectId) {
    this._id = _id;
  }
  _id: ObjectId;
}
