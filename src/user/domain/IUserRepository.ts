import { User } from './User';
import { UserSnapshot } from './UserSnapshot';

export interface UserRepository {
  findById(id: string): Promise<User>;
  findByEmail(email: string): Promise<UserSnapshot>;
  save(user: User): Promise<UserSnapshot>;
  delete(id: string): Promise<boolean>;
  update(user: User): Promise<boolean>;
}
