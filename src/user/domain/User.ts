import { Uuid } from '../../shared/domain/Uuid';
import { UserEmail } from './UserEmail';
import { UserName } from './UserName';
import { UserPassword } from './UserPassword';
import { UserRole } from './UserRole';
import { UserDto } from './dto/UserDto';
import { Column, Entity, ObjectIdColumn } from 'typeorm';
// import { JWTToken } from './JWTToken';
// import { RefreshToken } from './RefreshToken';

@Entity()
export class User {
  @ObjectIdColumn()
  private id: string;

  @Column()
  private firstName: string;

  @Column()
  private lastName: string;

  @Column()
  private email: string;

  @Column()
  private password: string;

  @Column()
  private isVerified: boolean;

  @Column()
  private isEmailVerified: boolean;

  // no docs for mongodb
  @Column({ type: 'enum', enum: [UserRole] })
  private userRoles: [UserRole];

  @Column()
  private isBanned: boolean;

  @Column()
  private isDeleted: boolean;

  // @Column()
  // private accessToken: JWTToken;

  // @Column()
  // private refreshToken: RefreshToken;

  @Column('date')
  private lastActive: Date;

  constructor(
    id: Uuid,
    firstName: UserName,
    lastName: UserName,
    email: UserEmail,
    password: UserPassword,
  ) {
    this.id = id.toString();
    this.firstName = firstName.toString();
    this.lastName = lastName.toString();
    this.email = email.toString();
    this.password = password.toString();
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
    this.lastActive = new Date();
  }
}
