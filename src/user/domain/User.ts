import { Uuid } from '../../shared/domain/Uuid';
import { Column, Entity } from 'typeorm';
// import { JWTToken } from './JWTToken';
// import { RefreshToken } from './RefreshToken';
import { UserEmail } from './UserEmail';
import { UserName } from './UserName';
import { UserPassword } from './UserPassword';
import { UserRole } from './UserRole';
import { UserDto } from './dto/UserDto';

@Entity('users')
export class User {
  @Column(() => Uuid)
  private id: Uuid;

  @Column(() => UserName)
  private firstName: UserName;

  @Column(() => UserName)
  private lastName: UserName;

  @Column(() => UserEmail)
  private email: UserEmail;

  @Column(() => UserPassword)
  private password: UserPassword;

  @Column()
  private isVerified: boolean;

  @Column()
  private isEmailVerified: boolean;

  @Column()
  private userRoles: UserRole[];

  @Column()
  private isBanned: boolean;

  @Column()
  private isDeleted: boolean;

  // @Column()
  // private accessToken: JWTToken;

  // @Column()
  // private refreshToken: RefreshToken;

  @Column()
  private lastActive: Date;

  constructor(
    id: Uuid,
    firstName: UserName,
    lastName: UserName,
    email: UserEmail,
    password: UserPassword,
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.isVerified = false;
    this.isEmailVerified = false;
    this.userRoles = [UserRole.USER];
    this.isBanned = false;
    this.isDeleted = false;
    // this.accessToken = new JWTToken();
    // this.refreshToken = new RefreshToken();
    this.lastActive = new Date();
  }

  toDto(): UserDto {
    return new UserDto(
      this.id.toString(),
      this.firstName.toString(),
      this.lastName.toString(),
      this.email.toString(),
      this.password.toString(),
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
    this.firstName = firstName;
  }

  setLastName(lastName: UserName): void {
    // this.lastName = new UserName(lastName, UserNameTypes.LAST);
    this.lastName = lastName;
  }

  setEmail(email: UserEmail): void {
    // this.email = new UserEmail(email);
    this.email = email;
  }

  setPassword(password: UserPassword): void {
    // this.password = await UserPassword.createPassword(password);
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
    this.lastActive = new Date();
  }
}
