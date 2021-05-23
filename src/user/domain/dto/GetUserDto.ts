import { AutoMap } from '@automapper/classes';

export class GetUserDto {
  @AutoMap()
  readonly id: string;
  @AutoMap()
  readonly firstName: string;
  @AutoMap()
  readonly lastName: string;
  @AutoMap()
  readonly email: string;
  @AutoMap()
  readonly isVerified: boolean;
}
