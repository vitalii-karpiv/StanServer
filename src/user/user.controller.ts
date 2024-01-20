import { Body, Controller, HttpCode, Param, Post, Get, Delete, Patch } from "@nestjs/common";
import { UserService } from "./user.service";
import { ValidationPipe } from "../utils/validation.pipe";
import { CreateUserDtoIn } from "./dto/create-user.dto.in";
import { CreateUserDtoOut } from "./dto/create-user.dto.out";
import { GetUserDtoOut } from "./dto/get-user.dto.out";
import { DeleteUserDtoIn } from "./dto/delete-user.dto.in";
import { UpdateUserDtoIn } from "./dto/update-user.dto.in";
import { UpdateUserDtoOut } from "./dto/update-user.dto.out";
import { ListUserDtoIn } from "./dto/list-user.dto.in";
import { ListUserDtoOut } from "./dto/list-user.dto.out";
// import { ObjectId } from "typeorm";
import { ObjectId } from "mongodb";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(201)
  create(@Body(new ValidationPipe()) createUserDtoIn: CreateUserDtoIn): Promise<CreateUserDtoOut> {
    return this.userService.create(createUserDtoIn);
  }

  @Get(":id")
  get(@Param("id") id: number): Promise<GetUserDtoOut> {
    const _id = new ObjectId(id);
    return this.userService.get(_id);
  }

  @Delete()
  @HttpCode(204)
  delete(@Body(new ValidationPipe()) deleteUserInDto: DeleteUserDtoIn): Promise<void> {
    return this.userService.delete(deleteUserInDto);
  }

  @Patch()
  update(@Body(new ValidationPipe()) updateUserDtoIn: UpdateUserDtoIn): Promise<UpdateUserDtoOut> {
    return this.userService.update(updateUserDtoIn);
  }

  @Get()
  list(@Body(new ValidationPipe()) listUserInDto: ListUserDtoIn): Promise<ListUserDtoOut> {
    return this.userService.list(listUserInDto);
  }
}
