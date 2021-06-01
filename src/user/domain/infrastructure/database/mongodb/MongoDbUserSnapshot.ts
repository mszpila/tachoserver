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
    readonly oauthId: string,
    readonly isEmailVerified = false,
    readonly userRoles = Array<UserRole>(UserRole.USER),
    readonly isVerified = false,
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
      oauthId,
      isEmailVerified,
      userRoles,
      isVerified,
      isBanned,
      isDeleted,
      lastActive,
    );
  }
}
