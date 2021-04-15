import { User } from './User';
import { Uuid } from '../../shared/domain/Uuid';

export interface UserRepository {
  save(user: User): void;
}
