import { UserDto } from './dto/UserDto';

export interface UserQueryRepository {
  findById(id: string): UserDto | Promise<UserDto>;
}
