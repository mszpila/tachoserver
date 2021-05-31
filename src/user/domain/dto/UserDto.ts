import { AutoMap } from '@automapper/classes';

export class CreateUserDto {
  @AutoMap()
  readonly id: string;
  @AutoMap()
  readonly firstName: string;
  @AutoMap()
  readonly lastName: string;
  @AutoMap()
  readonly email: string;
  @AutoMap()
  readonly password: string;
}
