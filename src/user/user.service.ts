import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ObjectId, Repository } from "typeorm";
import { User } from "./model/user.model";
import { CreateUserDtoIn } from "./dto/create-user.dto.in";
import { CreateUserDtoOut } from "./dto/create-user.dto.out";
import { GetUserDtoOut } from "./dto/get-user.dto.out";
import { UpdateUserDtoIn } from "./dto/update-user.dto.in";
import { UpdateUserDtoOut } from "./dto/update-user.dto.out";
import { ListUserDtoIn } from "./dto/list-user.dto.in";
import { ListUserDtoOut } from "./dto/list-user.dto.out";
import { PageInfo } from "src/utils/domain/page.info";
import { RefreshToken } from "../auth/model/refresh-token.model";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async create(createUserDtoIn: CreateUserDtoIn) {
    // STEP 1. - Check if a user exists by email.
    const alreadyExistUser = await this.userRepository.findOneBy({ email: createUserDtoIn.email });
    if (alreadyExistUser) {
      throw new BadRequestException({
        statusCode: 400,
        message: "User with this email is exist in database.",
        paramMap: {
          email: createUserDtoIn.email,
        },
      });
    }
    // STEP 2. - If email doesn't exist, then create new user,
    const user = {
      ...createUserDtoIn,
    };
    // STEP 3. - Save user to the database.
    let savedUser;
    try {
      savedUser = await this.userRepository.save(user);
    } catch (e) {
      throw new BadRequestException({
        statusCode: 400,
        message: "Create user in database failed.",
        paramMap: {
          cause: e,
        },
      });
    }
    // STEP 3. - Return properly filled DTO.
    return new CreateUserDtoOut(savedUser._id);
  }

  async get(_id: ObjectId): Promise<GetUserDtoOut> {
    // STEP 1. - Retrieve user from dataBase.
    const user = await this.userRepository.findOneBy({
      _id,
    });
    // STEP 2. - Check whether user exists.
    if (!user) {
      throw new NotFoundException({ statusCode: 404, message: "User was not found.", paramMap: { _id } });
    }
    // STEP 3. - Return properly filled DTO.
    return {
      ...user,
    };
  }

  async getByEmail(email: string) {
    // STEP 1. - Retrieve user from dataBase.
    return await this.userRepository.findOneBy({
      email,
    });
  }

  async delete({ _id }) {
    // STEP 1. - Remove user's refresh tokens
    try {
      await this.refreshTokenRepository.delete({ user: _id });
    } catch (e) {
      throw new BadRequestException({
        statusCode: 400,
        message: "Remove user's refresh token from database failed.",
        paramMap: {
          cause: e,
        },
      });
    }
    // STEP 2. - Remove user by _id.
    try {
      await this.userRepository.delete({
        _id,
      });
    } catch (e) {
      throw new BadRequestException({
        statusCode: 400,
        message: "Delete user from database is failed.",
        paramMap: {
          cause: e,
        },
      });
    }
  }

  async update(updateUserInDto: UpdateUserDtoIn) {
    // STEP 1. - Check if the user exists.
    const user = await this.userRepository.findOneBy({
      _id: updateUserInDto._id,
    });

    // STEP 2. - Check if user with given _id exists.
    if (!user) {
      throw new NotFoundException({
        statusCode: 404,
        message: "User with given _id not found.",
        paramMap: { _id: updateUserInDto._id },
      });
    }

    const update: User = {
      ...user,
      ...updateUserInDto,
    };

    // STEP 3. - Save User to the database.
    let savedUser;
    try {
      savedUser = await this.userRepository.save(update);
    } catch (e) {
      throw new BadRequestException({
        statusCode: 400,
        message: "Update user in database failed." + e + "",
        paramMap: {
          cause: e,
        },
      });
    }

    // STEP 4. - Return properly filled DTO.
    return new UpdateUserDtoOut(savedUser._id);
  }

  async list(listUserInDto: ListUserDtoIn) {
    // STEP 1. - Set default values.
    const pageInfo: PageInfo = {
      pageIndex: 0,
      pageSize: 10,
      ...listUserInDto.pageInfo,
    };
    // STEP 2. - Retrieve users.
    const findOptions = {
      skip: pageInfo.pageIndex * pageInfo.pageSize,
      take: pageInfo.pageSize,
      order: null,
    };
    if (listUserInDto.sortInfo) {
      findOptions.order = {
        ...listUserInDto.sortInfo,
      };
    }
    const users = await this.userRepository.find(findOptions);
    // STEP 3. - Return properly filled dtoOut.
    return new ListUserDtoOut(users, pageInfo);
  }
}
