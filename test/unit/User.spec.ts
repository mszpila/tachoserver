import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserDomainEventNativePublisher } from '../../src/user/domain/infrastructure/UserDomainEventNativePublisher';
import { DomainEvent } from '../../src/shared/infrastructure/events/DomainEvent';
import { UploadDocumentDto } from '../../src/user/domain/dto/UploadDocumentDto';
import { UserDto } from '../../src/user/domain/dto/UserDto';
import { UserConfiguration } from '../../src/user/domain/UserConfiguration';
import { UserFacade } from '../../src/user/domain/UserFacade';
import { SampleUser } from '../sample_data/SampleUser';
import { UserDomainEventNativeListener } from '../../src/user/domain/infrastructure/UserDomainEventNativeListener';
import {
  USER_VERIFIED,
  VERIFICATION_REQUESTED,
} from '../../src/shared/infrastructure/events/EventTopic';

const eventEmitterSingleton = new EventEmitter2();
const eventDomainPublisher = new UserDomainEventNativePublisher(
  eventEmitterSingleton,
);
const userFacade: UserFacade = new UserConfiguration().userFacade(
  eventDomainPublisher,
);
new UserDomainEventNativeListener(userFacade, eventEmitterSingleton);

// create a user
const JohnMarston: UserDto = SampleUser.sampleNewUser();
const AnakinSkywalker: UserDto = SampleUser.sampleNewUser({
  id: '15605809-1557-49fe-a58d-c861d2291689',
  firstName: 'Anakin',
  lastName: 'Skywalker',
  email: 'skywalker@gmail.com',
  password: 'xk&@fqT5h',
});
const AdrianMonk: UserDto = SampleUser.sampleNewUser({
  id: '851f5ee6-59e3-41ca-942b-943e926e21cf',
  firstName: 'Adrian',
  lastName: 'Monk',
  email: 'a.monk@gmail.com',
  password: '57*-?#xMNL',
});

describe('registration', () => {
  test('should register a new user', async () => {
    expect(await userFacade.register(JohnMarston)).toBeTruthy();
    expect(await userFacade.register(AnakinSkywalker)).toBeTruthy();
    expect(await userFacade.register(AdrianMonk)).toBeTruthy();
  });

  test('should not register a new user due to bad email', async () => {
    // given
    const badUser = SampleUser.sampleNewUser({ id: '', email: 'qwerty' });
    // then
    await expect(userFacade.register(badUser)).rejects.toThrowError(
      'Email address is not valid',
    );
  });

  test('should not register a new user due to empty email', async () => {
    // given
    const badUser = SampleUser.sampleNewUser({ id: '', email: '' });
    // then
    await expect(userFacade.register(badUser)).rejects.toThrowError(
      'Email address is not valid',
    );
  });

  test('should not register a new user due to already used email', async () => {
    // given
    const badUser = SampleUser.sampleNewUser(AdrianMonk);
    // then
    await expect(userFacade.register(badUser)).rejects.toThrowError(
      'Email already used',
    );
  });

  test('should not register a new user due to too short first name', async () => {
    // given
    const badUser = SampleUser.sampleNewUser({ id: '', firstName: 'I' });
    // then
    await expect(userFacade.register(badUser)).rejects.toThrowError(
      'First name is too short',
    );
  });

  test('should not register a new user due to too long first name', async () => {
    // given
    const badUser = SampleUser.sampleNewUser({
      id: '',
      firstName: 'qwertyuiopasdfghjklzxcvbnmqwert',
    });
    // then
    await expect(userFacade.register(badUser)).rejects.toThrowError(
      'First name is too long',
    );
  });

  test('should not register a new user due to too short last name', async () => {
    // given
    const badUser = SampleUser.sampleNewUser({ id: '', lastName: 'I' });
    // then
    await expect(userFacade.register(badUser)).rejects.toThrowError(
      'Last name is too short',
    );
  });

  test('should not register a new user due to too long last name', async () => {
    // given
    const badUser = SampleUser.sampleNewUser({
      id: '',
      lastName: 'qwertyuiopasdfghjklzxcvbnmqwert',
    });
    // then
    await expect(userFacade.register(badUser)).rejects.toThrowError(
      'Last name is too long',
    );
  });

  test('should not register a new user due to bad id (optional param)', async () => {
    // given
    const badUser = SampleUser.sampleNewUser({
      id: '123',
    });
    // then
    await expect(userFacade.register(badUser)).rejects.toThrowError(
      'Id is not a valid UUID value',
    );
  });

  test('should not register a new user due to empty password', async () => {
    // given
    const badUser = SampleUser.sampleNewUser({
      email: 'foo@example.com',
      password: '',
    });
    // then
    await expect(userFacade.register(badUser)).rejects.toThrowError(
      'Password is not valid',
    );
  });

  test('should not register a new user due to too short password', async () => {
    // given
    const badUser = SampleUser.sampleNewUser({
      password: 'p123!@',
    });
    // then
    await expect(userFacade.register(badUser)).rejects.toThrowError(
      'Password is not valid',
    );
  });

  test('should not register a new user due to password does not contain at least one special character', async () => {
    // given
    const badUser = SampleUser.sampleNewUser({
      password: 'Password1234',
    });
    // then
    await expect(userFacade.register(badUser)).rejects.toThrowError(
      'Password is not valid',
    );
  });

  test('should not register a new user due to password does not contain at least one uppercase character', async () => {
    // given
    const badUser = SampleUser.sampleNewUser({
      password: 'password1234!',
    });
    // then
    await expect(userFacade.register(badUser)).rejects.toThrowError(
      'Password is not valid',
    );
  });

  test('should not register a new user due to password does not contain at least one lowercase character', async () => {
    // given
    const badUser = SampleUser.sampleNewUser({
      password: 'PASSWORD1234!',
    });
    // then
    await expect(userFacade.register(badUser)).rejects.toThrowError(
      'Password is not valid',
    );
  });
});

describe('get', () => {
  test('should get the user by id', async () => {
    expect(await userFacade.getById(JohnMarston.id)).toEqual(
      SampleUser.sampleGetUser(JohnMarston),
    );
  });

  test('should get the all users (defaultly) sorted first name asc', async () => {
    // when
    const foundUsers = await userFacade.find({});
    // then
    console.log(foundUsers);
    expect(foundUsers[2]).toEqual(SampleUser.sampleGetUser(JohnMarston));
    expect(foundUsers[1]).toEqual(SampleUser.sampleGetUser(AnakinSkywalker));
    expect(foundUsers[0]).toEqual(SampleUser.sampleGetUser(AdrianMonk));
  });

  test('should get the sorted first name desc users list', async () => {
    // when
    const foundUsers = await userFacade.find({ sort: 'fnd' });
    // then
    expect(foundUsers[0]).toEqual(SampleUser.sampleGetUser(JohnMarston));
    expect(foundUsers[1]).toEqual(SampleUser.sampleGetUser(AnakinSkywalker));
    expect(foundUsers[2]).toEqual(SampleUser.sampleGetUser(AdrianMonk));
  });

  test('should get only the first user on the list', async () => {
    // when
    const foundUsers = await userFacade.find({ limit: 1 });
    // then
    expect(foundUsers).toContainEqual(SampleUser.sampleGetUser(AdrianMonk));
    expect(foundUsers).not.toContainEqual(
      SampleUser.sampleGetUser(AnakinSkywalker),
    );
    expect(foundUsers).not.toContainEqual(
      SampleUser.sampleGetUser(JohnMarston),
    );
  });

  test('should get the users from the second user on the list', async () => {
    // when
    const foundUsers = await userFacade.find({ offset: 1 });
    // then
    expect(foundUsers).not.toContainEqual(SampleUser.sampleGetUser(AdrianMonk));
    expect(foundUsers).toContainEqual(
      SampleUser.sampleGetUser(AnakinSkywalker),
    );
    expect(foundUsers).toContainEqual(SampleUser.sampleGetUser(JohnMarston));
  });

  test('should get only the users with "an" in the name on the list', async () => {
    // when
    const foundUsers = await userFacade.find({ sort: 'fnd', name: 'an' });
    // then
    expect(foundUsers).not.toContainEqual(
      SampleUser.sampleGetUser(JohnMarston),
    );
    expect(foundUsers).toContainEqual(
      SampleUser.sampleGetUser(AnakinSkywalker),
    );
    // expect(foundUsers).toContainEqual(SampleUser.sampleGetUser(AdrianMonk));
  });

  // test('should get only the users with "st" in the name on the list', async () => {
  //   // when
  //   const foundUsers = await userFacade.find({ sort: 'fnd', name: 'st' });
  //   // then
  //   expect(foundUsers).toContainEqual(SampleUser.sampleGetUser(JohnMarston));
  //   expect(foundUsers).not.toContainEqual(
  //     SampleUser.sampleGetUser(AnakinSkywalker),
  //   );
  // });

  // test('should get only the users with "mst" in lastname on the list', async () => {
  //   // given two registered users
  //   userFacade.register(JohnMarston);
  //   userFacade.register(AnakinSkywalker);
  //   // when
  //   const foundUsers = await userFacade.find({ sort: 'fnd', lastName: 'mst' });
  //   // then
  //   expect(foundUsers).not.toContainEqual(SampleUser.sampleGetUser(JohnMarston));
  //   expect(foundUsers).not.toContainEqual(
  //     SampleUser.sampleGetUser(AnakinSkywalker),
  //   );
  // });
});

describe('upload', () => {
  //
});

describe('events', () => {
  test('should emit verification request', async () => {
    // given verification submission
    const publishMock = jest.spyOn(eventDomainPublisher, 'publish');
    const upload = new UploadDocumentDto();
    upload.frontUrl = 'http://localhost.com/frontImg';
    upload.backUrl = 'http://localhost.com/backImg';
    upload.selfieUrl = 'http://localhost.com/selfieImg';

    // when user send verification request
    await userFacade.submitVerification(AnakinSkywalker.id, upload);

    // then
    expect(publishMock).toHaveBeenCalledWith(
      new DomainEvent(VERIFICATION_REQUESTED, {
        userId: AnakinSkywalker.id,
        frontUrl: upload.frontUrl,
        backUrl: upload.backUrl,
        selfieUrl: upload.selfieUrl,
      }),
    );
  });

  test('should confirm the user due to emitted event', async () => {
    // given
    const payload = {
      id: AnakinSkywalker.id,
      isVerified: true,
    };
    // when
    eventDomainPublisher.publish(new DomainEvent(USER_VERIFIED, payload));
    // then
    expect(await userFacade.getById(AnakinSkywalker.id)).toMatchObject({
      isVerified: true,
    });
  });

  test('should get only the verified users', async () => {
    // when
    const foundUsers = await userFacade.find({ isVerified: true });
    // then
    expect(foundUsers).toContainEqual(
      SampleUser.sampleGetUser({ ...AnakinSkywalker, isVerified: true }),
    );
    expect(foundUsers).not.toContainEqual(SampleUser.sampleGetUser(AdrianMonk));
    expect(foundUsers).not.toContainEqual(
      SampleUser.sampleGetUser(JohnMarston),
    );
  });
});

describe('login', () => {
  test('should login', async () => {
    expect(
      await userFacade.login({
        email: AdrianMonk.email,
        password: AdrianMonk.password,
      }),
    ).toBeTruthy();
  });

  test('should not login due to wrong password', async () => {
    await expect(
      userFacade.login({
        email: AdrianMonk.email,
        password: 'password1234',
      }),
    ).rejects.toThrowError('Wrong credentials');
  });

  test('should not login due to wrong email', async () => {
    await expect(
      userFacade.login({
        email: 'monk@example.com',
        password: AdrianMonk.password,
      }),
    ).rejects.toThrowError('Wrong credentials');
  });
});

describe('update', () => {
  test('should update the password', async () => {
    // given
    const prevPassword = AnakinSkywalker.password;
    AnakinSkywalker.password = '^>3HkMVZ';
    // when
    await userFacade.update(AnakinSkywalker.id, {
      password: AnakinSkywalker.password,
    });
    // then
    expect(
      await userFacade.login({
        email: AnakinSkywalker.email,
        password: AnakinSkywalker.password,
      }),
    ).toBeTruthy();

    await expect(
      userFacade.login({
        email: AnakinSkywalker.email,
        password: prevPassword,
      }),
    ).rejects.toThrowError('Wrong credentials');
  });

  test('should update the email', async () => {
    // given
    const prevEmail = AnakinSkywalker.email;
    AnakinSkywalker.email = 'a.skywalker@gmail.com';
    // when
    await userFacade.update(AnakinSkywalker.id, {
      email: AnakinSkywalker.email,
    });
    // then
    expect(
      await userFacade.login({
        email: AnakinSkywalker.email,
        password: AnakinSkywalker.password,
      }),
    ).toBeTruthy();

    await expect(
      userFacade.login({
        email: prevEmail,
        password: AnakinSkywalker.password,
      }),
    ).rejects.toThrowError('Wrong credentials');
  });

  test('should update the first name', async () => {
    // given
    AnakinSkywalker.firstName = 'Darth';
    // when
    await userFacade.update(AnakinSkywalker.id, {
      firstName: AnakinSkywalker.firstName,
    });
    expect(await userFacade.getById(AnakinSkywalker.id)).toMatchObject({
      firstName: AnakinSkywalker.firstName,
    });
  });

  test('should update the last name', async () => {
    // given
    AnakinSkywalker.lastName = 'Vader';
    // when
    await userFacade.update(AnakinSkywalker.id, {
      lastName: AnakinSkywalker.lastName,
    });
    expect(await userFacade.getById(AnakinSkywalker.id)).toMatchObject({
      lastName: AnakinSkywalker.lastName,
    });
  });
});

describe('delete', () => {
  test('should delete a user', async () => {
    // when
    await userFacade.deleteById(JohnMarston.id);
    // then
    await expect(userFacade.getById(JohnMarston.id)).rejects.toThrowError(
      'User not found',
    );
  });
});

// corner cases
// ...
