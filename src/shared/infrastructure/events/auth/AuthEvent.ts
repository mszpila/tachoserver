import { LoginDto } from 'src/user/domain/dto/LoginDto';
import { UserDto } from 'src/user/domain/dto/UserDto';
import { DomainEvent } from '../IDomainEvent';

export class UserLoging implements DomainEvent {
  constructor(private data: LoginDto) {}

  getData(): LoginDto {
    return this.data;
  }
}

export class UserRegistering implements DomainEvent {
  constructor(private data: UserDto) {}

  getData(): UserDto {
    return this.data;
  }
}
