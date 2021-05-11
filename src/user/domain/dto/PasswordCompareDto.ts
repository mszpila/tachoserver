import { PartialType, PickType } from '@nestjs/mapped-types';
import { UserDto } from './UserDto';

// export class PassowrdCompareDto extends PartialType(
//   PickType(UserDto, ['password']),
// ) {}

// export class PassowrdCompareDto extends PartialType(
//   PickType(UserDto, ['password'] as const),
// ) {}

export class PassowrdCompareDto {
  readonly password: string;

  constructor(password: string) {
    this.password = password;
  }
}
