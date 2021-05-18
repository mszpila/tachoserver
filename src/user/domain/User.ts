// import { Uuid } from '../../shared/domain/Uuid';
import { UserEmail } from './UserEmail';
import { UserName } from './UserName';
import { UserPassword } from './UserPassword';
import { UserRole } from './UserRole';
import { UserDto } from './dto/UserDto';
import { UserSnapshot } from './UserSnapshot';
// import { Column, Entity, ObjectIdColumn } from 'typeorm';
// import { JWTToken } from './JWTToken';
// import { RefreshToken } from './RefreshToken';

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
  // private accessToken: string;
  // private refreshToken: string;
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
    // this.accessToken = new JWTToken();
    // this.refreshToken = new RefreshToken();
    this.lastActive = new Date().toISOString();
  }

  // constructor(
  //   id: Uuid,
  //   firstName: UserName,
  //   lastName: UserName,
  //   email: UserEmail,
  //   password: UserPassword,
  // ) {
  //   this.id = id.toString();
  //   this.firstName = firstName.toString();
  //   this.lastName = lastName.toString();
  //   this.email = email.toString();
  //   this.password = password.toString();
  //   this.isVerified = false;
  //   this.isEmailVerified = false;
  //   this.userRoles = [UserRole.USER];
  //   this.isBanned = false;
  //   this.isDeleted = false;
  //   // this.accessToken = new JWTToken();
  //   // this.refreshToken = new RefreshToken();
  //   this.lastActive = new Date();
  // }

  toDto(): UserDto {
    return new UserDto(
      this.id,
      this.firstName,
      this.lastName,
      this.email,
      this.password,
      this.isVerified,
    );
    // return UserDto.builder()
    //   .withId(this.id.toString())
    //   .withFirstName(this.firstName.toString())
    //   .withLastName(this.lastName.toString())
    //   .withEmail(this.email.toString())
    //   .withPassword(this.password.toString())
    //   .withIsVerified(this.isVerified)
    //   .build();
  }

  setFirstName(firstName: UserName): void {
    // this.firstName = new UserName(firstName, UserNameTypes.FIRST);
    this.firstName = firstName.toString();
  }

  setLastName(lastName: UserName): void {
    // this.lastName = new UserName(lastName, UserNameTypes.LAST);
    this.lastName = lastName.toString();
  }

  setEmail(email: UserEmail): void {
    // this.email = new UserEmail(email);
    this.email = email.toString();
  }

  setPassword(password: UserPassword): void {
    // this.password = await UserPassword.createPassword(password);
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
