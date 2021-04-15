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

// request dto doesn't have an ID property while the reponse does'

test('should be able to register a new user', async () => {
  // when
  userFacade.register(user1);
  // then
  expect(userFacade.getUser(user1.id)).toEqual({
    id: user1.id,
    firstName: user1.firstName,
    lastName: user1.lastName,
    email: user1.email,
  });
});

// test('should be able to get users list', () => {
//   // given two registered users
//   userFacade.register(user1);
//   userFacade.register(user2);
//   // when
//   const foundUsers: UserDto[] = userFacade.find(new PageRequest(0, 10));
//   // then
//   expect(foundUsers).toContain(user1);
//   expect(foundUsers).toContain(user2);
// });

// corner cases
// ...
