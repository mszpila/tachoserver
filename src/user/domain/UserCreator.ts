import { Uuid } from '../../shared/domain/Uuid';
import { UserDto } from './dto/UserDto';
import { User } from './User';
import { UserEmail } from './UserEmail';
import { UserName, UserNameTypes } from './UserName';
import { UserPassword } from './UserPassword';

export class UserCreator {
  async from(source: UserDto): Promise<User> {
    const id: Uuid = new Uuid(source.id);
    const firstName: UserName = new UserName(
      source.firstName,
      UserNameTypes.FIRST,
    );
    const lastName: UserName = new UserName(
      source.lastName,
      UserNameTypes.LAST,
    );
    const email: UserEmail = new UserEmail(source.email);
    const password: UserPassword = await UserPassword.createPassword(
      source.password,
    );
    return new User(id, firstName, lastName, email, password);
  }
}
