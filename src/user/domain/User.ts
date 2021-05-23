import { Uuid } from '../../shared/domain/Uuid';
import { UserEmail } from './UserEmail';
import { UserName, UserNameTypes } from './UserName';
import { UserPassword } from './UserPassword';
import { UserRole } from './UserRole';
// import { UserDto } from './dto/UserDto';
import { UserSnapshot } from './UserSnapshot';

export class User {
  private id: Uuid;
  private firstName: UserName;
  private lastName: UserName;
  private email: UserEmail;
  private password: UserPassword;
  private isVerified: boolean;
  private isEmailVerified: boolean;
  private userRoles: UserRole[];
  private isBanned: boolean;
  private isDeleted: boolean;
  private lastActive: string;

  static restore(userSnapshot: UserSnapshot): User {
    return new User(userSnapshot);
  }

  private constructor(userSnapshot: UserSnapshot) {
    this.id = new Uuid(userSnapshot.id);
    this.firstName = new UserName(userSnapshot.firstName, UserNameTypes.FIRST);
    this.lastName = new UserName(userSnapshot.lastName, UserNameTypes.LAST);
    this.email = new UserEmail(userSnapshot.email);
    this.password = UserPassword.restoreHashedPassword(userSnapshot.password);
    this.isVerified = userSnapshot.isVerified;
    this.isEmailVerified = userSnapshot.isEmailVerified;
    this.userRoles = userSnapshot.userRoles;
    this.isBanned = userSnapshot.isBanned;
    this.isDeleted = userSnapshot.isDeleted;
    this.lastActive = new Date().toISOString();
  }

  // toDto(): UserDto {
  //   return {
  //     id: this.id,
  //     firstName: this.firstName,
  //     lastName: this.lastName,
  //     email: this.email,
  //     password: this.password,
  //     isVerified: this.isVerified,
  //   };
  // }

  toSnapShot(): UserSnapshot {
    return new UserSnapshot(
      this.id.toString(),
      this.firstName.toString(),
      this.lastName.toString(),
      this.email.toString(),
      this.password.toString(),
      this.isVerified,
      this.isEmailVerified,
      this.userRoles,
      this.isBanned,
      this.isDeleted,
      this.lastActive,
    );
  }

  setFirstName(firstName: UserName): void {
    this.firstName = firstName;
  }

  setLastName(lastName: UserName): void {
    this.lastName = lastName;
  }

  setEmail(email: UserEmail): void {
    this.email = email;
  }

  setPassword(password: UserPassword): void {
    this.password = password;
  }

  setIsVerified(isVerified: boolean) {
    this.isVerified = isVerified;
  }

  setIsEmailVerified(isEmailVerified: boolean) {
    this.isEmailVerified = isEmailVerified;
  }

  addRole(roleToAdd: UserRole): void {
    this.userRoles.push(roleToAdd);
  }

  removeRole(roleToRemove: UserRole): void {
    this.userRoles.filter((role) => role !== roleToRemove);
  }

  setIsBanned(isBanned: boolean): void {
    this.isBanned = isBanned;
  }

  setIsDeleted(isDeleted: boolean): void {
    this.isDeleted = isDeleted;
  }

  setLastActive(): void {
    this.lastActive = new Date().toISOString();
  }
}
