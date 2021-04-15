import { User } from './User';
import { UserRepository } from './IUserRepository';
import { UserDto } from './dto/UserDto';
import { UserQueryRepository } from './IUserQueryRepository';
// import { Uuid } from '../../shared/domain/Uuid';

interface obj {
  [key: string]: string;
}

export class InMemoryUserRepository
  implements UserRepository, UserQueryRepository {
  private map: Map<string, obj> = new Map<string, obj>();

  save(user: User): void {
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

  findById(id: string): UserDto {
    const user = this.map.get(id);
    return UserDto.builder()
      .id(user.id)
      .firstName(user.firstName)
      .lastName(user.lastName)
      .email(user.email)
      .build();
  }

  // delete(user: User): void {}

  // findAll(): Page<User> {}
}
