import { UserRole } from '../../../src/user/domain/UserRole';
import { UserSnapshot } from '../../../src/user/domain/UserSnapshot';

export const SAMPLE_USER_MAP: UserSnapshot = {
  id: '900f5943-af00-445d-b67e-c7646166dbc9',
  firstName: 'John',
  lastName: 'Marston',
  email: 'j.marston@gmail.com',
  password: `'6U'y5v(>1',!`,
  isVerified: false,
  isEmailVerified: false,
  userRoles: [UserRole.USER],
  isBanned: false,
  isDeleted: false,
  lastActive: new Date().toISOString(),
};
