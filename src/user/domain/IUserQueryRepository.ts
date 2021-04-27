import { FindDto } from './dto/FindDto';
import { GetUserDto } from './dto/GetUserDto';

export interface UserQueryRepository {
  // findById(id: string): Promise<UserDto>;
  find(query: FindDto): Promise<GetUserDto[]>;
  findByEmail(email: string): Promise<GetUserDto>;
}
