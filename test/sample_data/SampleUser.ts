// https://youtu.be/kW-k9UXhGqw?t=5783
// import { GetUserDto } from '../../src/user/domain/dto/GetUserDto';
import { UserDto } from '../../src/user/domain/dto/UserDto';
import { SAMPLE_NEW_USER_MAP } from './SAMPLE_NEW_USER_MAP';

export class SampleUser {
  static sampleNewUser(properties = {}): UserDto {
    const sample = Object.assign({}, SAMPLE_NEW_USER_MAP, properties);
    return UserDto.builder()
      .withId(sample.id as string)
      .withFirstName(sample.firstName as string)
      .withLastName(sample.lastName as string)
      .withEmail(sample.email as string)
      .withPassword(sample.password as string)
      .withIsVerified(sample.isVerified as boolean)
      .build();
  }

  static sampleGetUser(user: UserDto): UserDto {
    return UserDto.builder()
      .withId(user.id)
      .withFirstName(user.firstName)
      .withLastName(user.lastName)
      .withEmail(user.email)
      .withIsVerified(user.isVerified)
      .build();
  }
}
