import * as mongo from 'mongodb';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectCollection } from 'nest-mongodb';
import { getMongoManager, getMongoRepository, Like } from 'typeorm';
import { FindUserDto } from '../dto/FindUserDto';
import { PassowrdCompareDto } from '../dto/PasswordCompareDto';
import { UserDto } from '../dto/UserDto';
import { UserQueryRepository } from '../IUserQueryRepository';
import { UserRepository } from '../IUserRepository';
import { User } from '../User';
import { UserSnapshot } from '../UserSnapshot';
import { GetUserDto } from '../dto/GetUserDto';

// @Injectable()
export class MongoDbUserRepository
  implements UserRepository, UserQueryRepository {
  // constructor(private entityManager = getMongoManager()) {}
  // constructor(
  //   @InjectRepository(User) private entityManager = getMongoRepository(User),
  // ) {}
  constructor(
    @InjectCollection('users') private readonly repository: mongo.Collection,
  ) {}

  async save(user: User): Promise<boolean> {
    if (!user) {
      throw new BadRequestException('User cannot be null');
    }
    if (this.findByEmail(user.toDto().email)) {
      throw new BadRequestException('Email already used');
    }
    await this.repository.insertOne(user);
    // await this.entityManager.save(user);
    return Promise.resolve(true);
  }

  async findById(id: string): Promise<User> {
    const user: UserSnapshot = await this.repository.findOne({ _id: id });
    // const user = await this.entityManager.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return Promise.resolve(User.restore(user));
    // return await this.entityManager.findOneOrFail(User, id);
  }

  async delete(id: string): Promise<boolean> {
    await this.repository.deleteOne({ _id: id });
    return Promise.resolve(true);
  }

  async find(query: FindUserDto): Promise<GetUserDto[]> {
    const foundUsers: UserSnapshot[] = await this.repository
      .find({
        $or: [
          { firstName: new RegExp(`${query.name}`, 'i') },
          { lastName: new RegExp(`${query.name}`, 'i') },
        ],
        isVerified: { $in: query.isVerified ? [true] : [true, false] },
      })
      .project({ _id: 0 })
      .sort(query.sort)
      .skip(query.offset)
      .limit(query.limit)
      .toArray();
    return foundUsers.map(
      (user) =>
        new GetUserDto(
          user.id,
          user.firstName,
          user.lastName,
          user.email,
          user.isVerified,
        ),
    );
  }

  findByEmailToComparePassowrd(email: string): Promise<PassowrdCompareDto> {
    throw new Error('Method not implemented.');
  }

  async findByEmail(email: string): Promise<User> {
    const user: UserSnapshot = await this.repository.findOne({ email });
    if (!user) {
      throw new NotFoundException('Wrong credentials');
    }
    return Promise.resolve(User.restore(user));
  }

  async update(user: User): Promise<boolean> {
    await this.repository.updateOne({ _id: user.toDto().id }, user);
    return Promise.resolve(true);
  }
}
