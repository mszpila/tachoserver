import { FindDto } from './dto/FindDto';
import { User } from './User';

export interface UserQueryRepository {
  findById(id: string): Promise<User>;
  find(query: FindDto): Promise<User[]>;
  findByEmail(email: string): Promise<User>;
}
