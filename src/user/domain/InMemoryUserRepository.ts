import { User } from './User';
import { UserRepository } from './IUserRepository';
import { UserQueryRepository } from './IUserQueryRepository';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { FindUserDto } from './dto/FindUserDto';
// import { UserDto } from './dto/UserDto';
import { userMapper } from './service/Mapper';
import { GetUserDto } from './dto/GetUserDto';
import { UserSnapshot } from './UserSnapshot';

export class InMemoryUserRepository
  implements UserRepository, UserQueryRepository {
  private map: Map<string, User> = new Map<string, User>();

  async save(user: User): Promise<UserSnapshot> {
    if (!user) {
      throw new BadRequestException('User cannot be null');
    }
    // if (this.alreadyExists(user.toSnapShot().email)) {
    //   throw new BadRequestException('Email already used');
    // }
    this.map.set(user.toSnapShot().id, user);
    return user.toSnapShot();
  }

  async findById(id: string): Promise<User> {
    const user = this.map.get(id);
    if (!user) {
      // throw new NotFoundException('User not found');
      return null;
    }
    return user;
  }

  async update(user: User): Promise<boolean> {
    this.map.set(user.toSnapShot().id, user);
    return true;
  }

  async delete(id: string): Promise<boolean> {
    this.map.delete(id);
    return true;
  }

  async find(query: FindUserDto): Promise<GetUserDto[]> {
    const users = this.mapToArray();
    const usersFiltered = this.findFilter(users, query);
    this.findSort(usersFiltered, query);
    const userPage = this.findPage(usersFiltered, query);
    return userMapper.mapArray(userPage, GetUserDto, UserSnapshot);
  }

  async findByEmail(email: string): Promise<User> {
    const users: User[] = this.mapToEntityArray();
    const userFound = users.filter(
      (user: User) => user.getEmail() === email,
    )[0];
    if (!userFound) {
      // throw new NotFoundException('Wrong credentials');
      return null;
    }
    return userFound;
  }

  private mapToArray = (): UserSnapshot[] => {
    const users: UserSnapshot[] = [];
    this.map.forEach((user) => {
      users.push(user.toSnapShot());
    });
    return users;
  };

  private mapToEntityArray = (): User[] => {
    const users: User[] = [];
    this.map.forEach((user) => {
      users.push(user);
    });
    return users;
  };

  private findFilter = (
    users: UserSnapshot[],
    query: FindUserDto,
  ): UserSnapshot[] => {
    return users.filter((user: UserSnapshot) => {
      if (
        user.firstName.toLowerCase().includes(query.name || '') ||
        user.lastName.toLowerCase().includes(query.name || '')
      ) {
        return !query.isVerified || user.isVerified;
      }
      return false;
    });
  };

  private findSort = (
    users: UserSnapshot[],
    query: FindUserDto,
  ): UserSnapshot[] => {
    switch (query.sort) {
      case 'fnd':
        return users
          .sort((a: UserSnapshot, b: UserSnapshot) =>
            a.firstName.localeCompare(b.firstName),
          )
          .reverse();
      case 'lna':
        return users.sort((a: UserSnapshot, b: UserSnapshot) =>
          a.lastName.localeCompare(b.lastName),
        );
      case 'lnd':
        return users
          .sort((a: UserSnapshot, b: UserSnapshot) =>
            a.lastName.localeCompare(b.lastName),
          )
          .reverse();
      default:
        return users.sort((a: UserSnapshot, b: UserSnapshot) =>
          a.firstName.localeCompare(b.firstName),
        );
    }
  };

  private findPage = (
    users: UserSnapshot[],
    query: FindUserDto,
  ): UserSnapshot[] => {
    return users.slice(query.offset || 0, query.limit || 20);
  };

  private alreadyExists = (email: string): boolean => {
    const users = this.mapToEntityArray();
    return users.some((user: User) => user.toSnapShot().email === email);
  };
}
