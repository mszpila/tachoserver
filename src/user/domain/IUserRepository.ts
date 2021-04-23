import { User } from './User';

export interface UserRepository {
  save(user: User): Promise<boolean>;
  delete(id: string): Promise<boolean>;
  findAndUpdate(id: string, user: User): Promise<boolean>;
}
