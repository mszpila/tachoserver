import { UserEmail } from './UserEmail';
import { UserName } from './UserName';
import { UserPassword } from './UserPassword';
import { UserRole } from './UserRole';
import { UserDto } from './dto/UserDto';
import { UserSnapshot } from './UserSnapshot';
import { Uuid } from '../../shared/domain/Uuid';

export class User {
  private id: string;
  private firstName: string;
  private lastName: string;
  private email: string;
  private password: string;
  private isVerified: boolean;
  private isEmailVerified: boolean;
  private userRoles: string[];
  private isBanned: boolean;
  private isDeleted: boolean;
  private lastActive: string;

  static restore(userSnapshot: UserSnapshot): User {
    return new User(userSnapshot);
  }

  private constructor(userSnapshot: UserSnapshot) {
    this.id = userSnapshot.id;
    this.firstName = userSnapshot.firstName;
    this.lastName = userSnapshot.lastName;
    this.email = userSnapshot.email;
    this.password = userSnapshot.password;
    this.isVerified = userSnapshot.isVerified;
    this.isEmailVerified = userSnapshot.isEmailVerified;
    this.userRoles = userSnapshot.userRoles;
    this.isBanned = userSnapshot.isBanned;
    this.isDeleted = userSnapshot.isDeleted;
    this.lastActive = new Date().toISOString();
  }

  // toDto(): UserDto {
  //   return new UserDto(
  //     this.id,
  //     this.firstName,
  //     this.lastName,
  //     this.email,
  //     this.password,
  //     this.isVerified,
  //   );
  // }

  toSnapShot(): UserSnapshot {
    return new UserSnapshot(
      this.id,
      this.firstName,
      this.lastName,
      this.email,
      this.password,
      this.isVerified,
      this.isEmailVerified,
      this.userRoles,
      this.isBanned,
      this.isDeleted,
      this.lastActive,
    );
  }

  setFirstName(firstName: UserName): void {
    this.firstName = firstName.toString();
  }

  setLastName(lastName: UserName): void {
    this.lastName = lastName.toString();
  }

  setEmail(email: UserEmail): void {
    this.email = email.toString();
  }

  setPassword(password: UserPassword): void {
    this.password = password.toString();
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
