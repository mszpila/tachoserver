import { Uuid } from '../../shared/domain/Uuid';
import { Column, Entity, ObjectIdColumn } from 'typeorm';
// import { JWTToken } from './JWTToken';
// import { RefreshToken } from './RefreshToken';
import { UserEmail } from './UserEmail';
import { UserName, UserNameTypes } from './UserName';
import { UserPassword } from './UserPassword';
import { UserRoles } from './UserRoles';
import { AutoMap } from '@automapper/classes';
import { UserDto } from './dto/UserDto';
import { UserBuilder } from './UserBuilder';

@Entity('users')
export class User {
  @Column(() => Uuid)
  @AutoMap({ typeFn: () => Uuid })
  private id: Uuid;

  @Column(() => UserName)
  @AutoMap({ typeFn: () => UserName })
  private firstName: UserName;

  @Column(() => UserName)
  @AutoMap({ typeFn: () => UserName })
  private lastName: UserName;

  @Column(() => UserEmail)
  @AutoMap({ typeFn: () => UserEmail })
  private email: UserEmail;

  @Column(() => UserPassword)
  @AutoMap({ typeFn: () => UserPassword })
  private password: UserPassword;

  @Column()
  private isVerified: boolean;

  @Column()
  private isEmailVerified: boolean;

  @Column()
  // @AutoMap({ typeFn: () => String })
  private userRoles: UserRoles[];

  @Column()
  // @AutoMap({ typeFn: () => Boolean })
  private isBanned: boolean;

  @Column()
  // @AutoMap({ typeFn: () => Boolean })
  private isDeleted: boolean;
  // @Column()
  // private accessToken: JWTToken;
  // @Column()
  // private refreshToken: RefreshToken;

  @Column()
  // @AutoMap({ typeFn: () => Date })
  private lastActive: Date;

  constructor(
    id: Uuid,
    firstName: UserName,
    lastName: UserName,
    email: UserEmail,
    password: UserPassword,
    isVerified: boolean,
    isEmailVerified: boolean,
    userRoles: UserRoles[],
    isBanned: boolean,
    isDeleted: boolean,
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.isVerified = isVerified;
    this.isEmailVerified = isEmailVerified;
    this.userRoles = userRoles;
    this.isBanned = isBanned;
    this.isDeleted = isDeleted;
    // this.accessToken = new JWTToken();
    // this.refreshToken = new RefreshToken();
    this.lastActive = new Date();
  }

  toDto(): UserDto {
    return UserDto.builder()
      .id(this.id.toString())
      .firstName(this.firstName.toString())
      .lastName(this.lastName.toString())
      .email(this.email.toString())
      .password(this.password.toString())
      .isVerified(this.isVerified)
      .build();
  }

  static builder(): UserBuilder {
    return new UserBuilder();
  }

  setFirstName(firstName: string) {
    this.firstName = new UserName(firstName, UserNameTypes.FIRST);
  }

  setLastName(lastName: string) {
    this.lastName = new UserName(lastName, UserNameTypes.LAST);
  }

  setEmail(email: string) {
    this.email = new UserEmail(email);
  }

  setIsVerified(isVerified: boolean) {
    this.isVerified = isVerified;
  }

  setIsEmailVerified(isEmailVerified: boolean) {
    this.isEmailVerified = isEmailVerified;
  }

  async setPassword(password: string) {
    this.password = await UserPassword.builder().password(password);
  }
}
