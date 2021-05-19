import * as mongo from 'mongodb';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectCollection } from 'nest-mongodb';
import { FindUserDto } from '../dto/FindUserDto';
import { PassowrdCompareDto } from '../dto/PasswordCompareDto';
import { UserQueryRepository } from '../IUserQueryRepository';
import { UserRepository } from '../IUserRepository';
import { User } from '../User';
import { UserSnapshot } from '../UserSnapshot';
import { GetUserDto } from '../dto/GetUserDto';

@Injectable()
export class MongoDbUserRepository
  implements UserRepository, UserQueryRepository {
  constructor(
    @InjectCollection('users') private readonly repository: mongo.Collection,
  ) {}

  async save(user: User): Promise<boolean> {
    if (!user) {
      throw new BadRequestException('User cannot be null');
    }
    if (await this.alreadyExists(user.toDto().email)) {
      throw new BadRequestException('Email already used');
    }
    await this.repository.insertOne(user);
    return Promise.resolve(true);
  }

  async findById(id: string): Promise<User> {
    const user: UserSnapshot = await this.repository.findOne({ id: id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return Promise.resolve(User.restore(user));
  }

  async delete(id: string): Promise<boolean> {
    await this.repository.deleteOne({ id: id });
    return Promise.resolve(true);
  }

  async find(query: FindUserDto): Promise<GetUserDto[]> {
    const foundUsers: UserSnapshot[] = await this.repository
      .find({
        $or: [
          { firstName: new RegExp(`${query.name || ''}`, 'i') },
          { lastName: new RegExp(`${query.name || ''}`, 'i') },
        ],
        isVerified: { $in: query.isVerified ? [true] : [true, false] },
      })
      .sort(this.convertDtoQuerySortToMongoDbSortObject(query.sort))
      .skip(Number(query.offset) || 0)
      .limit(Number(query.limit) || 20)
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

  async findByEmailToComparePassowrd(
    email: string,
  ): Promise<PassowrdCompareDto> {
    const userFound: UserSnapshot = await this.repository.findOne({ email });
    if (!userFound) {
      throw new NotFoundException('Wrong credentials');
    }
    return new PassowrdCompareDto(userFound.password);
  }

  async update(user: User): Promise<boolean> {
    // try {
    await this.repository.replaceOne({ id: user.toDto().id }, user);
    // } catch (err) {
    //   console.log(err);
    // }
    return Promise.resolve(true);
  }

  private alreadyExists = async (email: string): Promise<boolean> => {
    return await this.repository.findOne({ email });
  };

  private convertDtoQuerySortToMongoDbSortObject = (sortOption: string) => {
    switch (sortOption) {
      case 'fnd':
        return { firstName: -1 };
      case 'lna':
        return { lastName: 1 };
      case 'lnd':
        return { lastName: -1 };
      default:
        return { firstName: 1 };
    }
  };
}
