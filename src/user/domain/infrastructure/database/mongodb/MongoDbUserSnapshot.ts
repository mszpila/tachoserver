import { Binary } from 'bson';
import { UserRole } from '../../../UserRole';
import { UserSnapshot } from '../../../UserSnapshot';

export class MongoDbUserSnapshot extends UserSnapshot {
  constructor(
    readonly _id: Binary,
    readonly firstName: string,
    readonly lastName: string,
    readonly email: string,
    readonly password: string,
    readonly isVerified = false,
    readonly isEmailVerified = false,
    readonly userRoles = Array<string>(UserRole.USER),
    readonly isBanned = false,
    readonly isDeleted = false,
    readonly lastActive = new Date().toISOString(),
  ) {
    super(
      null,
      firstName,
      lastName,
      email,
      password,
      isVerified,
      isEmailVerified,
      userRoles,
      isBanned,
      isDeleted,
      lastActive,
    );
  }
}
