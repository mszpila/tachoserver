// import { OmitType, PartialType } from '@nestjs/mapped-types';
// import { UserDto } from './UserDto';

// export class GetUserDto extends PartialType(
//   OmitType(UserDto, ['password'] as const),
// ) {}

export class GetUserDto {
  readonly id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly isVerified: boolean;

  constructor(
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    isVerified: boolean,
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.isVerified = isVerified;
  }
}
