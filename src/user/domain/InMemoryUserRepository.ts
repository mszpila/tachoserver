import { User } from './User';
import { UserRepository } from './IUserRepository';
import { UserQueryRepository } from './IUserQueryRepository';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { FindUserDto } from './dto/FindUserDto';
// import { UserUpdateDto } from './dto/UpdateDto';
import { UserDto } from './dto/UserDto';
import { PassowrdCompareDto } from './dto/PasswordCompareDto';

// interface obj {
//   [key: string]: string;
// }

export class InMemoryUserRepository
  implements UserRepository, UserQueryRepository {
  private map: Map<string, User> = new Map<string, User>();

  async save(user: User): Promise<boolean> {
    if (!user) {
      throw new BadRequestException('User cannot be null');
    }
    if (this.alreadyExists(user.toDto().email)) {
      throw new BadRequestException('Email already used');
    }
    this.map.set(user.toDto().id, user);
    return Promise.resolve(true);
  }

  async findById(id: string): Promise<User> {
    const user = this.map.get(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return Promise.resolve(user);
  }

  async delete(id: string): Promise<boolean> {
    this.map.delete(id);
    return Promise.resolve(true);
  }

  async find(query: FindUserDto): Promise<UserDto[]> {
    const users = this.mapToArray();
    const usersFiltered = this.findFilter(users, query);
    this.findSort(usersFiltered, query);

    return await Promise.resolve(this.findSlice(usersFiltered, query));
  }

  async findByEmailToComparePassowrd(
    email: string,
  ): Promise<PassowrdCompareDto> {
    const users: UserDto[] = this.mapToArray();
    const userFound = users.filter((user: UserDto) => user.email === email)[0];
    if (!userFound) {
      throw new NotFoundException('Wrong credentials');
    }
    return Promise.resolve({ password: userFound.password });
  }

  async update(user: User): Promise<boolean> {
    this.map.set(user.toDto().id, user);
    return Promise.resolve(true);
  }

  private mapToArray = (): UserDto[] => {
    const users: UserDto[] = [];
    this.map.forEach((user) => {
      users.push(user.toDto());
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

  private findFilter = (users: UserDto[], query: FindUserDto): UserDto[] => {
    return users.filter((user: UserDto) => {
      if (
        user.firstName.toLowerCase().includes(query.name) ||
        user.lastName.toLowerCase().includes(query.name)
      ) {
        return !query.isVerified || user.isVerified;
      }
      return false;
    });
  };

  private findSort = (users: UserDto[], query: FindUserDto): UserDto[] => {
    switch (query.sort) {
      case 'fnd':
        return users
          .sort((a: UserDto, b: UserDto) =>
            a.firstName.localeCompare(b.firstName),
          )
          .reverse();
      case 'lna':
        return users.sort((a: UserDto, b: UserDto) =>
          a.lastName.localeCompare(b.lastName),
        );
      case 'lnd':
        return users
          .sort((a: UserDto, b: UserDto) =>
            a.lastName.localeCompare(b.lastName),
          )
          .reverse();
      default:
        return users.sort((a: UserDto, b: UserDto) =>
          a.firstName.localeCompare(b.firstName),
        );
    }
  };

  private findSlice = (users: UserDto[], query: FindUserDto): UserDto[] => {
    return users.slice(query.offset, query.offset + query.limit);
  };

  private alreadyExists = (email: string): boolean => {
    const users = this.mapToEntityArray();
    return users.some((user: User) => user.toDto().email === email);
  };
}
