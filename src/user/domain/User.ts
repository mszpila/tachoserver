import { Uuid } from '../../shared/domain/Uuid';
import { Column, Entity, ObjectIdColumn } from 'typeorm';
// import { JWTToken } from './JWTToken';
// import { RefreshToken } from './RefreshToken';
import { UserEmail } from './UserEmail';
import { UserName, UserNameTypes } from './UserName';
import { UserPassword } from './UserPassword';
import { UserType } from './UserType';

@Entity('users')
export class User {
  @ObjectIdColumn()
  private _id: Uuid;
  @Column()
  private firstName: UserName;
  @Column()
  private lastName: UserName;
  @Column()
  private email: UserEmail;
  @Column()
  private password: UserPassword;
  @Column()
  private isVerified: boolean;
  @Column()
  private isEmailVerified: boolean;
  @Column()
  private userRoles: UserType[];
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

  private constructor(
    id: Uuid,
    firstName: UserName,
    lastName: UserName,
    email: UserEmail,
    password?: UserPassword,
  ) {
    this._id = id;
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

  get id(): Uuid {
    return this._id;
  }

  static create(
    firstName: UserName,
    lastName: UserName,
    email: UserEmail,
    password?: UserPassword,
    id?: Uuid,
  ): User {
    return new User(id, firstName, lastName, email, password);
  }

  toString() {
    return Object.assign(
      {},
      { id: this._id.toString() },
      { firstName: this.firstName.toString() },
      { lastName: this.lastName.toString() },
      { email: this.email.toString() },
    );
  }
}
