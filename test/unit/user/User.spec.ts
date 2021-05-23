import { UserDto } from '../../../src/user/domain/dto/UserDto';
import { SampleUser } from '../../sample_data/user/SampleUser';
import {
  USER_VERIFIED,
  VERIFICATION_REQUESTED,
} from '../../../src/shared/infrastructure/events/user/EventTopic';
import {
  UserVerificationRequest,
  UserVerified,
} from '../../../src/shared/infrastructure/events/user/UserEvent';
import { userFacade, eventDomainPublisher } from './helpers/moduleInit';

// creating sample users
const JohnMarston: UserDto = SampleUser.sampleNewUser();
const AdrianMonk: UserDto = SampleUser.sampleNewUser({
  id: '851f5ee6-59e3-41ca-942b-943e926e21cf',
  firstName: 'Adrian',
  lastName: 'Monk',
  email: 'a.monk@gmail.com',
  password: '57*-?#xMNL',
});
let AnakinSkywalker: UserDto = SampleUser.sampleNewUser({
  id: '15605809-1557-49fe-a58d-c861d2291689',
  firstName: 'Anakin',
  lastName: 'Skywalker',
  email: 'skywalker@gmail.com',
  password: 'xk&@fqT5h',
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

  test('should not register a new user due to empty first name', async () => {
    // given
    const badUser = SampleUser.sampleNewUser({ id: '', firstName: '' });
    // then
    await expect(userFacade.register(badUser)).rejects.toThrowError(
      'First name field must be provided',
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
  });
});

describe('upload', () => {
  //
});

describe('events', () => {
  test('should emit verification request', async () => {
    // given verification submission
    const publishMock = jest.spyOn(eventDomainPublisher, 'publish');
    const frontUrl = 'http://localhost.com/frontImg';
    const backUrl = 'http://localhost.com/backImg';
    const selfieUrl = 'http://localhost.com/selfieImg';
    const upload = { frontUrl, backUrl, selfieUrl };

    // when user send verification request
    await userFacade.submitVerification(AnakinSkywalker.id, upload);

    // then
    expect(publishMock).toHaveBeenCalledWith(
      VERIFICATION_REQUESTED,
      new UserVerificationRequest({
        id: AnakinSkywalker.id,
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
    eventDomainPublisher.publish(USER_VERIFIED, new UserVerified(payload));
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
    AnakinSkywalker = { ...AnakinSkywalker, password: '^>3HkMVZ' };
    // const updateDto: UserUpdateDto = { password: AnakinSkywalker.password };
    // UserUpdateDto.builder()
    //   .withPassword(AnakinSkywalker.password)
    //   .build();

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
    AnakinSkywalker = { ...AnakinSkywalker, email: 'a.skywalker@gmail.com' };
    // const updateDto: UserUpdateDto = UserUpdateDto.builder()
    //   .withEmail(AnakinSkywalker.email)
    //   .build();

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
    AnakinSkywalker = { ...AnakinSkywalker, firstName: 'Darth' };
    // const updateDto: UserUpdateDto = UserUpdateDto.builder()
    //   .withFirstName(AnakinSkywalker.firstName)
    //   .build();

    // when
    await userFacade.update(AnakinSkywalker.id, {
      firstName: AnakinSkywalker.firstName,
    });

    // then
    expect(await userFacade.getById(AnakinSkywalker.id)).toMatchObject({
      firstName: AnakinSkywalker.firstName,
    });
  });

  test('should update the last name', async () => {
    // given
    AnakinSkywalker = { ...AnakinSkywalker, lastName: 'Vader' };
    // const updateDto: UserUpdateDto = UserUpdateDto.builder()
    //   .withLastName(AnakinSkywalker.lastName)
    //   .build();

    // when
    await userFacade.update(AnakinSkywalker.id, {
      lastName: AnakinSkywalker.lastName,
    });

    // then
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
