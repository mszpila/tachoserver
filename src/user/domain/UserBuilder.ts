import { Uuid } from '../../shared/domain/Uuid';
import { User } from './User';
import { UserEmail } from './UserEmail';
import { UserName, UserNameTypes } from './UserName';
import { UserPassword } from './UserPassword';
import { UserRoles } from './UserRoles';

export class UserBuilder {
  public id: Uuid;
  public firstName: UserName;
  public lastName: UserName;
  public email: UserEmail;
  public password: UserPassword;
  public isVerified = false;
  public isEmailVerified = false;
  public userRoles = [UserRoles.USER];
  public isBanned = false;
  public isDeleted = false;
  // public accessToken: JWTToken;
  // public refreshToken: RefreshToken;

  withId(id: string): UserBuilder {
    this.id = new Uuid(id);
    return this;
  }

  withFirstName(firstName: string): UserBuilder {
    this.firstName = new UserName(firstName, UserNameTypes.FIRST);
    return this;
  }

  withLastName(lastName: string): UserBuilder {
    this.lastName = new UserName(lastName, UserNameTypes.LAST);
    return this;
  }

  withEmail(email: string): UserBuilder {
    this.email = new UserEmail(email);
    return this;
  }

  async withPassword(
    password: string,
    alreadyHashed = false,
  ): Promise<UserBuilder> {
    this.password = await UserPassword.builder().withPassword(
      password,
      alreadyHashed,
    );
    return this;
  }

  withIsVerified(isVerified: boolean): UserBuilder {
    this.isVerified = isVerified;
    return this;
  }

  withIsEmailVerified(isEmailVerified: boolean): UserBuilder {
    this.isEmailVerified = isEmailVerified;
    return this;
  }

  withUserRoles(userRoles: UserRoles[]): UserBuilder {
    this.userRoles = userRoles;
    return this;
  }

  withIsBanned(isBanned: boolean): UserBuilder {
    this.isBanned = isBanned;
    return this;
  }

  withIsDeleted(isDeleted: boolean): UserBuilder {
    this.isDeleted = isDeleted;
    return this;
  }

  build(): User {
    return new User(this);
  }
}
