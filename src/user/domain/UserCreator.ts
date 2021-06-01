import { OAuthUserDto } from '../../shared/authentication';
import { Uuid } from '../../shared/domain/Uuid';
import { CreateUserDto } from './dto/UserDto';
import { User } from './User';
import { UserEmail } from './UserEmail';
import { UserName, UserNameTypes } from './UserName';
import { UserPassword } from './UserPassword';
import { UserSnapshot } from './UserSnapshot';

export class UserCreator {
  async from(source: CreateUserDto): Promise<User> {
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
    return User.restore(
      new UserSnapshot(
        id.toString(),
        firstName.toString(),
        lastName.toString(),
        email.toString(),
        password.toString(),
      ),
    );
  }

  fromOAuth(source: OAuthUserDto): User {
    const id: Uuid = new Uuid();
    return User.restore(
      new UserSnapshot(
        id.toString(),
        source.firstName,
        source.lastName,
        source.email,
        null,
        source.id,
        true,
      ),
    );
  }
}
