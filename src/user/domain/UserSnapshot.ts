import { UserRole } from './UserRole';

export class UserSnapshot {
  constructor(
    readonly id: string,
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
  ) {}
}
