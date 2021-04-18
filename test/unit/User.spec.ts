import { PageRequest } from '../../src/shared/domain/PageRequest';
import { GetUserDto } from '../../src/user/domain/dto/GetUserDto';
import { UserDto } from '../../src/user/domain/dto/UserDto';
import { UserConfiguration } from '../../src/user/domain/UserConfiguration';
import { UserFacade } from '../../src/user/domain/UserFacade';
import { SampleUser } from '../sample_data/SampleUser';

const userFacade: UserFacade = new UserConfiguration().userFacade();

// create a user
const user1: UserDto = SampleUser.sampleNewUser();
const user2: UserDto = SampleUser.sampleNewUser({
  id: '15605809-1557-49fe-a58d-c861d2291689',
  firstName: 'Anakin',
  lastName: 'Skywalker',
  email: 'skywalker@gmail.com',
  password: 'republic1234',
});

test('should be able to register a new user', async () => {
  // when
  userFacade.register(user1);
  // then
  expect(userFacade.getUser(user1.id)).toEqual(SampleUser.sampleGetUser(user1));
});

test('should be able to get users list', () => {
  // given two registered users
  userFacade.register(user1);
  userFacade.register(user2);
  // when
  const foundUsers = userFacade.findUsers(new PageRequest(0, 10));
  // then
  expect(foundUsers).toContainEqual(SampleUser.sampleGetUser(user1));
  expect(foundUsers).toContainEqual(SampleUser.sampleGetUser(user2));
});

// corner cases
// ...
