// https://youtu.be/kW-k9UXhGqw?t=5783
import { GetUserDto } from '../../src/user/domain/dto/GetUserDto';
import { UserDto } from '../../src/user/domain/dto/UserDto';
import { SAMPLE_NEW_USER_MAP } from './SAMPLE_NEW_USER_MAP';

export class SampleUser {
  static sampleNewUser(properties = {}): UserDto {
    const sample = Object.assign({}, SAMPLE_NEW_USER_MAP, properties);
    return new UserDto(
      sample.id,
      sample.firstName,
      sample.lastName,
      sample.email,
      sample.password,
      sample.isVerified,
    );
  }

  static sampleGetUser(user: UserDto): GetUserDto {
    return new GetUserDto(
      user.id,
      user.firstName,
      user.lastName,
      user.email,
      user.isVerified,
    );
  }
}
