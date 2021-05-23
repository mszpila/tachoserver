import { FindUserDto } from './dto/FindUserDto';
import { GetUserDto } from './dto/GetUserDto';

export interface UserQueryRepository {
  // findById(id: string): Promise<UserDto>;
  find(query: FindUserDto): Promise<GetUserDto[]>;
  findByEmailToComparePassowrd(email: string): Promise<string>;
}
