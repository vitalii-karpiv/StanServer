import { IsObject, IsOptional } from "class-validator";
import { PageInfo } from "../../utils/domain/page.info";

export class ListUserDtoIn {
  @IsObject()
  @IsOptional()
  // TODO: make validation more strict
  sortInfo: any; // TODO: implement sort info datatype

  pageInfo: PageInfo;
}
