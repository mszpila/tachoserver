import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { getMongoManager, Like } from 'typeorm';
import { FindUserDto } from '../dto/FindUserDto';
import { PassowrdCompareDto } from '../dto/PasswordCompareDto';
import { UserDto } from '../dto/UserDto';
import { UserQueryRepository } from '../IUserQueryRepository';
import { UserRepository } from '../IUserRepository';
import { User } from '../User';

@Injectable()
export class MongoDbUserRepository
  implements UserRepository, UserQueryRepository {
  constructor(private entityManager = getMongoManager()) {}

  async save(user: User): Promise<boolean> {
    if (!user) {
      throw new BadRequestException('User cannot be null');
    }
    if (this.findByEmail(user.toDto().email)) {
      throw new BadRequestException('Email already used');
    }
    await this.entityManager.save(user);
    return Promise.resolve(true);
  }

  async findById(id: string): Promise<User> {
    const user = await this.entityManager.findOne(User, id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return Promise.resolve(user);
    // return await this.entityManager.findOneOrFail(User, id);
  }

  async delete(id: string): Promise<boolean> {
    await this.entityManager.delete(User, id);
    return Promise.resolve(true);
  }

  async find(query: FindUserDto): Promise<UserDto[]> {
    const foundUsers: User[] = await this.entityManager.find(User, {
      where: {
        firstName: Like(`%${query.name}`),
        lastName: Like(`%${query.name}`),
        isVerified: { $in: query.isVerified ? [true] : [true, false] },
      },
      order: query.sort,
      skip: query.offset,
      take: query.limit,
    });
    return foundUsers.map((user) => user.toDto());
  }

  findByEmailToComparePassowrd(email: string): Promise<PassowrdCompareDto> {
    throw new Error('Method not implemented.');
  }

  async findByEmail(email: string): Promise<User> {
    // const user = await this.userModel.aggregate([
    //   { $match: { email } },
    //   { project: { _id: 0, password: 0 } },
    // ]);
    // const user = await this.userModel.findOne({ email }).exec();
    const user = await this.entityManager.findOne(User, email);
    if (!user) {
      throw new NotFoundException('Wrong credentials');
    }
    return Promise.resolve(user);
  }

  async update(user: User): Promise<boolean> {
    this.entityManager.save(user);
    return Promise.resolve(true);
  }
}
