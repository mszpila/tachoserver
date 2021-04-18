import { PageRequest } from 'src/shared/domain/PageRequest';
import { GetUserDto } from './dto/GetUserDto';

export interface UserQueryRepository {
  findById(id: string): any;
  find(pageRequest: PageRequest): any;
}
