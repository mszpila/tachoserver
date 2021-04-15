import { Injectable } from '@nestjs/common';
import { getManager } from 'typeorm';
import { UserDto } from '../dto/UserDto';
import { UserQueryRepository } from '../IUserQueryRepository';
import { UserRepository } from '../IUserRepository';
import { User } from '../User';

@Injectable()
export class MongoDbUserRepository
  implements UserRepository, UserQueryRepository {
  constructor(private entityManager = getManager()) {}

  async save(user: User): Promise<UserDto> {
    // requireNonNull(user);
    // this.map.set(user.dto.getId, user);
    // this.map.set('id', user);
    // return user;
    await this.entityManager.save(user);
    return UserDto.builder().id(user.id.getString()).build();
  }

  async findById(id: string): Promise<UserDto> {
    const foundUser = await this.entityManager.findOneOrFail(User, id);
    return UserDto.builder().id(foundUser.id.getString()).build();
  }
}
