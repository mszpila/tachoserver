// https://youtu.be/kW-k9UXhGqw?t=5783
import { GetUserDto } from '../../src/user/domain/dto/GetUserDto';
import { UserDto } from '../../src/user/domain/dto/UserDto';
import { SAMPLE_NEW_USER_MAP } from './SAMPLE_NEW_USER_MAP';

export class SampleUser {
  static sampleNewUser(properties = {}): UserDto {
    const sample = Object.assign({}, SAMPLE_NEW_USER_MAP, properties);
    return UserDto.builder()
      .id(sample.id as string)
      .firstName(sample.firstName as string)
      .lastName(sample.lastName as string)
      .email(sample.email as string)
      .password(sample.password as string)
      .build();
  }

  static sampleGetUser(user: UserDto): GetUserDto {
    return UserDto.builder()
      .id(user.id)
      .firstName(user.firstName)
      .lastName(user.lastName)
      .email(user.email)
      .build();
  }
}
