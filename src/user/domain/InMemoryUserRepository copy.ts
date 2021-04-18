import { User } from './User';
import { UserRepository } from './IUserRepository';
import { UserDto } from './dto/UserDto';
import { UserQueryRepository } from './IUserQueryRepository';
import { GetUserDto } from './dto/GetUserDto';
import { mapper } from './mapper/Mapper';
import { PageRequest } from 'src/shared/domain/PageRequest';
// import _ from 'lodash';
import * as _ from 'lodash';
// import { mapper } from './mapper/Mapper';
// import { Uuid } from 'src/shared/domain/Uuid';
// import { UserName, UserNameTypes } from './UserName';
// import { UserEmail } from './UserEmail';
// import { UserPassword } from './UserPassword';

interface obj {
  [key: string]: string;
}

export class InMemoryUserRepository
  implements UserRepository, UserQueryRepository {
  private map: Map<string, any> = new Map<string, any>();

  save(user: User): void {
    if (!user) {
      throw Error('User cannot be null');
    }
    if (this.map.has(user.id.toString())) {
      const alreadySaved = this.map.get(user.id.toString());
      this.map.set(
        user.id.toString(),
        Object.assign({}, alreadySaved, user.toString()),
      );
    } else {
      this.map.set(user.id.toString(), user.toString());
    }
  }

  findById(id: string): any {
    const user = this.map.get(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  // delete(user: User): void {}

  find(pageRequest: PageRequest): GetUserDto[] {
    const arr = _.toArray(this.map.values());
    // return
    const usersArray = [];
    for (const user of this.map.values()) {
      usersArray.push(
        UserDto.builder()
          .id(user.id)
          .firstName(user.firstName)
          .lastName(user.lastName)
          .email(user.email)
          .build(),
      );
    }
    return usersArray;
  }

  // buildResponse(
  //   users: any[],
  //   pageRequest: PageRequest,
  //   size: number,
  // ): GetUserDto[] {}
}
