import { OmitType, PartialType } from '@nestjs/mapped-types';
import { UserDto } from './UserDto';

export class GetUserDto extends PartialType(OmitType(UserDto, ['password'])) {}
