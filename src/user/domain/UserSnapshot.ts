import { UserRole } from './UserRole';

export class UserSnapshot {
  constructor(
    readonly id: string,
    readonly firstName: string,
    readonly lastName: string,
    readonly email: string,
    readonly password: string,
    readonly oauthId = null,
    readonly isEmailVerified = false,
    readonly userRoles = Array<UserRole>(UserRole.USER),
    readonly isVerified = false,
    readonly isBanned = false,
    readonly isDeleted = false,
    readonly lastActive = new Date().toISOString(),
  ) {}
}
