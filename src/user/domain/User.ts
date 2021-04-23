import { Uuid } from '../../shared/domain/Uuid';
import { Column, Entity, ObjectIdColumn } from 'typeorm';
// import { JWTToken } from './JWTToken';
// import { RefreshToken } from './RefreshToken';
import { UserEmail } from './UserEmail';
import { UserName } from './UserName';
import { UserPassword } from './UserPassword';
import { UserType } from './UserType';
import { AutoMap } from '@automapper/classes';
import { UserDto } from './dto/UserDto';

@Entity('users')
export class User {
  @ObjectIdColumn()
  @AutoMap({ typeFn: () => Uuid })
  private id: Uuid;

  @Column()
  @AutoMap({ typeFn: () => UserName })
  private firstName: UserName;

  @Column()
  @AutoMap({ typeFn: () => UserName })
  private lastName: UserName;

  @Column()
  @AutoMap({ typeFn: () => UserEmail })
  private email: UserEmail;

  @Column()
  @AutoMap({ typeFn: () => UserPassword })
  private password: UserPassword;

  @Column()
  private isVerified: boolean;

  @Column()
  private isEmailVerified: boolean;

  @Column()
  // @AutoMap({ typeFn: () => String })
  private userRoles: UserType[];

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
    password?: UserPassword,
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.isVerified = false;
    this.isEmailVerified = false;
    this.userRoles = [UserType.USER];
    this.isBanned = false;
    this.isDeleted = false;
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

  update(
    id?: Uuid,
    firstName?: UserName,
    lastName?: UserName,
    email?: UserEmail,
    password?: UserPassword,
  ): User {
    this.id = id ? id : this.id;
    this.firstName = firstName ? firstName : this.firstName;
    this.lastName = lastName ? lastName : this.lastName;
    this.email = email ? email : this.email;
    this.password = password ? password : this.password;
    return this;
  }
}
