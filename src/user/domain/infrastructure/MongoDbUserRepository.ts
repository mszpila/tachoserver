import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getMongoManager, Like } from 'typeorm';
import { FindDto } from '../dto/FindDto';
import { UserQueryRepository } from '../IUserQueryRepository';
import { UserRepository } from '../IUserRepository';
import { User } from '../User';

// @Injectable()
export class MongoDbUserRepository
  implements UserRepository, UserQueryRepository {
  constructor(private entityManager = getMongoManager()) {}
  // constructor(
  //   @InjectRepository(User) private entityManager = getMongoRepository(User),
  // ) {}

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

  async find(query: FindDto): Promise<User[]> {
    return await this.entityManager.find(User, {
      where: {
        firstName: Like(`%${query.name}`),
        lastName: Like(`%${query.name}`),
        isVerified: { $in: query.isVerified ? [true] : [true, false] },
      },
      order: query.sort,
      skip: query.offset,
      take: query.limit,
    });
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.entityManager.findOne(User, email);
    if (!user) {
      throw new NotFoundException('Wrong credentials');
    }
    return Promise.resolve(user);
  }

  async findAndUpdate(id: string, user: User): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
