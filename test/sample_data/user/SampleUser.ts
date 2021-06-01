// https://youtu.be/kW-k9UXhGqw?t=5783
import { userMapper } from '../../../src/user/domain/service/Mapper';
import { UserSnapshot } from '../../../src/user/domain/UserSnapshot';
import { GetUserDto } from '../../../src/user/domain/dto/GetUserDto';
import { CreateUserDto } from '../../../src/user/domain/dto/UserDto';
import { SAMPLE_USER_MAP } from './SAMPLE_NEW_USER_MAP';

export class SampleUser {
  static create(properties = {}): UserSnapshot {
    const sample = Object.assign({}, SAMPLE_USER_MAP, properties);
    return {
      id: sample.id,
      firstName: sample.firstName,
      lastName: sample.lastName,
      email: sample.email,
      password: sample.password,
      oauthId: sample.oauthId,
      isVerified: sample.isVerified,
      isEmailVerified: sample.isEmailVerified,
      userRoles: sample.userRoles,
      isBanned: sample.isBanned,
      isDeleted: sample.isDeleted,
      lastActive: sample.lastActive,
    };
  }

  static sampleNewUser(properties = {}): CreateUserDto {
    const sample = Object.assign({}, SAMPLE_USER_MAP, properties);
    return userMapper.map(sample, CreateUserDto, UserSnapshot);
  }

  static sampleGetUser(user: UserSnapshot): GetUserDto {
    return userMapper.map(user, GetUserDto, UserSnapshot);
  }
}
