import { Uuid } from '../../shared/domain/Uuid';
import { User } from './User';
import { UserEmail } from './UserEmail';
import { UserName, UserNameTypes } from './UserName';
import { UserPassword } from './UserPassword';
import { UserRoles } from './UserRoles';

export class UserBuilder {
  private _id: Uuid;
  private _firstName: UserName;
  private _lastName: UserName;
  private _email: UserEmail;
  private _password: UserPassword;
  private _isVerified = false;
  private _isEmailVerified = false;
  private _userRoles = [UserRoles.USER];
  private _isBanned = false;
  private _isDeleted = false;
  // private _accessToken: JWTToken;
  // private _refreshToken: RefreshToken;

  id(id: string): UserBuilder {
    this._id = new Uuid(id);
    return this;
  }

  firstName(firstName: string): UserBuilder {
    this._firstName = new UserName(firstName, UserNameTypes.FIRST);
    return this;
  }

  lastName(lastName: string): UserBuilder {
    this._lastName = new UserName(lastName, UserNameTypes.LAST);
    return this;
  }

  email(email: string): UserBuilder {
    this._email = new UserEmail(email);
    return this;
  }

  async password(password: string): Promise<UserBuilder> {
    this._password = await UserPassword.builder().password(password);
    return this;
  }

  isVerified(isVerified: boolean): UserBuilder {
    this._isVerified = isVerified;
    return this;
  }

  isEmailVerified(isEmailVerified: boolean): UserBuilder {
    this._isEmailVerified = isEmailVerified;
    return this;
  }

  userRoles(userRoles: UserRoles[]): UserBuilder {
    this._userRoles = userRoles;
    return this;
  }

  isBanned(isBanned: boolean): UserBuilder {
    this._isBanned = isBanned;
    return this;
  }

  isDeleted(isDeleted: boolean): UserBuilder {
    this._isDeleted = isDeleted;
    return this;
  }

  build(): User {
    return new User(
      this._id,
      this._firstName,
      this._lastName,
      this._email,
      this._password,
      this._isVerified,
      this._isEmailVerified,
      this._userRoles,
      this._isBanned,
      this._isDeleted,
    );
  }
}
