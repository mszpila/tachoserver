import { User } from './User';
import { UserRepository } from './IUserRepository';
import { UserQueryRepository } from './IUserQueryRepository';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { FindDto } from './dto/FindDto';

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

  async find(query: FindDto): Promise<User[]> {
    const users = this.mapToArray();
    const usersFiltered = this.findFilter(users, query);
    this.findSort(usersFiltered, query);

    return await Promise.resolve(this.findSlice(usersFiltered, query));
  }

  async findByEmail(email: string): Promise<User> {
    const users: User[] = this.mapToArray();
    const userFound = users.filter((user: User) => {
      if (user.toDto().email === email) {
        return true;
      }
    });
    if (!userFound[0]) {
      throw new NotFoundException('Wrong credentials');
    }
    return Promise.resolve(userFound[0]);
  }

  async findAndUpdate(id: string, user: User): Promise<boolean> {
    this.map.set(id, user);
    return Promise.resolve(true);
  }

  private mapToArray = (): User[] => {
    const users: User[] = [];
    this.map.forEach((user) => {
      users.push(user);
    });
    return users;
  };

  private findFilter = (users: User[], query: FindDto): User[] => {
    return users.filter((user: User) => {
      if (
        user.toDto().firstName.toLocaleLowerCase().includes(query.name) ||
        user.toDto().lastName.toLocaleLowerCase().includes(query.name)
      ) {
        if (query.isVerified && user.toDto().isVerified) {
          return true;
        } else if (query.isVerified && !user.toDto().isVerified) {
          return false;
        }
        return true;
      }
    });
  };

  private findSort = (users: User[], query: FindDto): User[] => {
    return users.sort((a: User, b: User) => {
      const key: string = Object.getOwnPropertyNames(query.sort)[0];
      const result =
        a.toDto()[key] < b.toDto()[key]
          ? -1
          : a.toDto()[key] > b.toDto()[key]
          ? 1
          : 0;
      return result * query.sort[key];
    });
  };

  private findSlice = (users: User[], query: FindDto): User[] => {
    return users.slice(query.offset, query.offset + query.limit);
  };

  private alreadyExists = (email: string): boolean => {
    const users = this.mapToArray();
    return users.some((user: User) => {
      if (user.toDto().email === email) {
        return true;
      }
    });
  };
}
