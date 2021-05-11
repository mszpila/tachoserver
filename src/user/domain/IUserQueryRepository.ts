import { FindUserDto } from './dto/FindUserDto';
import { GetUserDto } from './dto/GetUserDto';
import { PassowrdCompareDto } from './dto/PasswordCompareDto';

export interface UserQueryRepository {
  // findById(id: string): Promise<UserDto>;
  find(query: FindUserDto): Promise<GetUserDto[]>;
  findByEmailToComparePassowrd(email: string): Promise<PassowrdCompareDto>;
}
