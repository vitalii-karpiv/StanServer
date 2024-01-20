import { PageInfo } from "../../utils/domain/page.info";
import { User } from "../model/user.model";

export class ListUserDtoOut {
  constructor(itemList: User[], pageInfo: PageInfo) {
    this.itemList = itemList;
    this.pageInfo = pageInfo;
  }

  itemList: User[];
  pageInfo: PageInfo;
}
