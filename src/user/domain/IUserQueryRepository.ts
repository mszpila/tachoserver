import { FindDto } from './dto/FindDto';
import { UserDto } from './dto/UserDto';
import { User } from './User';

export interface UserQueryRepository {
  // findById(id: string): Promise<UserDto>;
  find(query: FindDto): Promise<UserDto[]>;
  findByEmail(email: string): Promise<UserDto>;
}
