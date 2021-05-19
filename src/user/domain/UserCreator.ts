import { Uuid } from '../../shared/domain/Uuid';
import MUUID from 'uuid-mongodb';
import { UserDto } from './dto/UserDto';
import { User } from './User';
import { UserEmail } from './UserEmail';
import { UserName, UserNameTypes } from './UserName';
import { UserPassword } from './UserPassword';
import { UserRole } from './UserRole';
import { UserSnapshot } from './UserSnapshot';
import { Binary } from 'bson';

export class UserCreator {
  async from(source: UserDto): Promise<User> {
    // const id: Binary = MUUID.v4();
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
    // return User.restore({
    //   id: id.toString(),
    //   firstName: firstName.toString(),
    //   lastName: lastName.toString(),
    //   email: email.toString(),
    //   password: password.toString(),
    //   isVerified: false,
    //   isEmailVerified: true,
    //   userRoles: [UserRole.USER],
    //   isBanned: false,
    //   isDeleted: false,
    //   date: new Date().toISOString(),
    // });
    return User.restore(
      new UserSnapshot(
        id.toString(),
        firstName.toString(),
        lastName.toString(),
        email.toString(),
        password.toString(),
      ),
    );
    // return new User(id, firstName, lastName, email, password);
  }
}
