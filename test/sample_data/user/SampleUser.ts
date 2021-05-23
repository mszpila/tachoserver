// https://youtu.be/kW-k9UXhGqw?t=5783
import { GetUserDto } from '../../../src/user/domain/dto/GetUserDto';
import { UserDto } from '../../../src/user/domain/dto/UserDto';
import { SAMPLE_NEW_USER_MAP } from './SAMPLE_NEW_USER_MAP';

export class SampleUser {
  static sampleNewUser(properties = {}): UserDto {
    const sample = Object.assign({}, SAMPLE_NEW_USER_MAP, properties);
    return {
      id: sample.id,
      firstName: sample.firstName,
      lastName: sample.lastName,
      email: sample.email,
      password: sample.password,
      isVerified: sample.isVerified,
    };
  }

  static sampleGetUser(user: UserDto): GetUserDto {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isVerified: user.isVerified,
    };
  }
}
