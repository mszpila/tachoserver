import { FindDto } from './dto/FindDto';
import { GetUserDto } from './dto/GetUserDto';
import { PassowrdCompareDto } from './dto/PasswordCompareDto';

export interface UserQueryRepository {
  // findById(id: string): Promise<UserDto>;
  find(query: FindDto): Promise<GetUserDto[]>;
  findByEmailToComparePassowrd(email: string): Promise<PassowrdCompareDto>;
}
