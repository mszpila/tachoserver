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

  constructor(builder: UserBuilder) {
    this.id = builder.id;
    this.firstName = builder.firstName;
    this.lastName = builder.lastName;
    this.email = builder.email;
    this.password = builder.password;
    this.isVerified = builder.isVerified;
    this.isEmailVerified = builder.isEmailVerified;
    this.userRoles = builder.userRoles;
    this.isBanned = builder.isBanned;
    this.isDeleted = builder.isDeleted;
    // this.accessToken = new JWTToken();
    // this.refreshToken = new RefreshToken();
    this.lastActive = new Date();
  }

  toDto(): UserDto {
    return UserDto.builder()
      .withId(this.id.toString())
      .withFirstName(this.firstName.toString())
      .withLastName(this.lastName.toString())
      .withEmail(this.email.toString())
      .withPassword(this.password.toString())
      .withIsVerified(this.isVerified)
      .build();
  }

  async toBuilder(): Promise<UserBuilder> {
    return User.builder()
      .withId(this.id.toString())
      .withFirstName(this.firstName.toString())
      .withLastName(this.lastName.toString())
      .withEmail(this.email.toString())
      .withIsVerified(this.isVerified)
      .withIsVerified(this.isVerified)
      .withUserRoles(this.userRoles)
      .withIsBanned(this.isBanned)
      .withIsDeleted(this.isDeleted)
      .withPassword(this.password.toString(), true);
  }

  static builder(): UserBuilder {
    return new UserBuilder();
  }

  // setFirstName(firstName: string) {
  //   this.firstName = new UserName(firstName, UserNameTypes.FIRST);
  // }

  // setLastName(lastName: string) {
  //   this.lastName = new UserName(lastName, UserNameTypes.LAST);
  // }

  // setEmail(email: string) {
  //   this.email = new UserEmail(email);
  // }

  // setIsVerified(isVerified: boolean) {
  //   this.isVerified = isVerified;
  // }

  // setIsEmailVerified(isEmailVerified: boolean) {
  //   this.isEmailVerified = isEmailVerified;
  // }

  // async setPassword(password: string) {
  //   this.password = await UserPassword.builder().withPassword(password);
  // }
}
