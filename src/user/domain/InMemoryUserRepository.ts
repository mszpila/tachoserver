import { User } from './User';
import { UserRepository } from './IUserRepository';
import { UserQueryRepository } from './IUserQueryRepository';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { FindDto } from './dto/FindDto';
import { UserUpdateDto } from './dto/UpdateDto';
import { UserDto } from './dto/UserDto';

interface obj {
  [key: string]: string;
}

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

  async find(query: FindDto): Promise<UserDto[]> {
    const users = this.mapToDtoArray();
    const usersFiltered = this.findFilter(users, query);
    this.findSort(usersFiltered, query);

    return await Promise.resolve(this.findSlice(usersFiltered, query));
  }

  async findByEmail(email: string): Promise<UserDto> {
    const users: UserDto[] = this.mapToDtoArray();
    const userFound = users.filter((user: UserDto) => {
      if (user.email === email) {
        return true;
      }
    });
    if (!userFound[0]) {
      throw new NotFoundException('Wrong credentials');
    }
    return Promise.resolve(userFound[0]);
  }

  async update(user: User): Promise<boolean> {
    this.map.set(user.toDto().id, user);
    return Promise.resolve(true);
  }

  private mapToDtoArray = (): UserDto[] => {
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

  private findFilter = (users: UserDto[], query: FindDto): UserDto[] => {
    return users.filter((user: UserDto) => {
      if (
        user.firstName.toLocaleLowerCase().includes(query.name) ||
        user.lastName.toLocaleLowerCase().includes(query.name)
      ) {
        if (query.isVerified && user.isVerified) {
          return true;
        } else if (query.isVerified && !user.isVerified) {
          return false;
        }
        return true;
      }
    });
  };

  private findSort = (users: UserDto[], query: FindDto): UserDto[] => {
    return users.sort((a: UserDto, b: UserDto) => {
      const key: string = Object.getOwnPropertyNames(query.sort)[0];
      const result = a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0;
      return result * query.sort[key];
    });
  };

  private findSlice = (users: UserDto[], query: FindDto): UserDto[] => {
    return users.slice(query.offset, query.offset + query.limit);
  };

  private alreadyExists = (email: string): boolean => {
    const users = this.mapToEntityArray();
    return users.some((user: User) => {
      if (user.toDto().email === email) {
        return true;
      }
    });
  };
}
