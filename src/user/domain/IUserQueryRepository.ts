import { FindUserDto } from './dto/FindUserDto';
import { GetUserDto } from './dto/GetUserDto';

export interface UserQueryRepository {
  find(query: FindUserDto): Promise<GetUserDto[]>;
}
