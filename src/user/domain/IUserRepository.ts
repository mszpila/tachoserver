import { User } from './User';

export interface UserRepository {
  findById(id: string): Promise<User>;
  save(user: User): Promise<boolean>;
  delete(id: string): Promise<boolean>;
  update(user: User): Promise<boolean>;
}
