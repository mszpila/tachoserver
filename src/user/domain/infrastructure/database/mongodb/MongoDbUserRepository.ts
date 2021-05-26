import * as mongo from 'mongodb';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectCollection } from 'nest-mongodb';
import { FindUserDto } from '../../../dto/FindUserDto';
import { UserQueryRepository } from '../../../IUserQueryRepository';
import { UserRepository } from '../../../IUserRepository';
import { User } from '../../../User';
import { UserSnapshot } from '../../../UserSnapshot';
import { GetUserDto } from '../../../dto/GetUserDto';
import { MongoDbUserSnapshot } from './MongoDbUserSnapshot';
import {
  fromBJSONToEntity,
  fromBJSONToGetUserDto,
  fromBJSONToUserSnapshot,
  fromEntityToBJSON,
} from './MongoDbMapper';
import { from as stringIdToBinary } from 'uuid-mongodb';

@Injectable()
export class MongoDbUserRepository
  implements UserRepository, UserQueryRepository {
  constructor(
    @InjectCollection('users') private readonly repository: mongo.Collection,
  ) {}

  async save(user: User): Promise<UserSnapshot> {
    if (!user) {
      throw new BadRequestException('User cannot be null');
    }
    // Since in the below if statement we state explicitly that a user with this email already exists,
    // it might a good idea to implement a mechanism preventing attackers from brute-forcing our
    // API in order to get a list of registered emails
    if (await this.alreadyExists(user.toSnapShot().email)) {
      throw new BadRequestException('Email already used');
    }
    await this.repository.insertOne(fromEntityToBJSON(user));
    return user.toSnapShot();
  }

  async findById(id: string): Promise<User> {
    const user: MongoDbUserSnapshot = await this.repository.findOne({
      _id: stringIdToBinary(id),
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return Promise.resolve(fromBJSONToEntity(user));
  }

  async update(user: User): Promise<boolean> {
    await this.repository.replaceOne(
      { _id: stringIdToBinary(user.toSnapShot().id) },
      fromEntityToBJSON(user),
    );
    return Promise.resolve(true);
  }

  async delete(id: string): Promise<boolean> {
    await this.repository.deleteOne({ _id: stringIdToBinary(id) });
    return Promise.resolve(true);
  }

  async find(query: FindUserDto): Promise<GetUserDto[]> {
    const foundUsers: MongoDbUserSnapshot[] = await this.repository
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
    return foundUsers.map((user) => fromBJSONToGetUserDto(user));
  }

  async findByEmail(email: string): Promise<UserSnapshot> {
    const userFound: MongoDbUserSnapshot = await this.repository.findOne({
      email,
    });
    if (!userFound) {
      throw new NotFoundException('Wrong credentials');
    }
    return fromBJSONToUserSnapshot(userFound);
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
