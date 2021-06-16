import * as mongo from 'mongodb';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { UserFacade } from '../../../src/user/domain/UserFacade';
import { moduleInitialization } from '../helpers/moduleInit';
import { SampleUser } from '../../sample_data/user/SampleUser';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../../../src/email/domain/EmailService';
import { UserRegistered } from '../../../src/shared/infrastructure/events/user/UserEvent';
import { UserSnapshot } from '../../../src/user/domain/UserSnapshot';

let app: INestApplication;
let userFacade: UserFacade;
// let mongodb: MongoClient;
let config: ConfigService;
let emailService: EmailService;

const JohnMarston: UserSnapshot = SampleUser.create();
const AdrianMonk: UserSnapshot = SampleUser.create({
  id: '851f5ee6-59e3-41ca-942b-943e926e21cf',
  firstName: 'Adrian',
  lastName: 'Monk',
  email: 'a.monk@gmail.com',
  password: '57*-?#xMNL',
});
const AnakinSkywalker: UserSnapshot = SampleUser.create({
  id: '15605809-1557-49fe-a58d-c861d2291689',
  firstName: 'Anakin',
  lastName: 'Skywalker',
  email: 'skywalker@gmail.com',
  password: 'xk&@fqT5h',
});

beforeAll(async () => {
  const module = await moduleInitialization();
  app = module.createNestApplication();
  await app.init();
  app.use(cookieParser());
  userFacade = module.get(UserFacade);
  // mongodb = await module.get(MongoModule);
  config = module.get(ConfigService);
  emailService = module.get(EmailService);
});

describe('/POST', () => {
  test('successfull registration', async () => {
    const registrationRequest = await request(app.getHttpServer())
      .post('/auth/register')
      .send(JohnMarston)
      .expect(201);
    expect(registrationRequest.body.access_token).toBeDefined();
    return await request(app.getHttpServer())
      .get(`/users/${JohnMarston.id}`)
      .send()
      .expect(200)
      .expect({ ...SampleUser.sampleGetUser(JohnMarston) });
  });

  test('successfull email confirmation', async () => {
    const token = await emailService.sendRegistrationEmail(
      new UserRegistered({
        id: JohnMarston.id,
        email: JohnMarston.email,
        firstName: JohnMarston.firstName,
      }),
    );
    await emailService.confirmEmail(token);
    console.log(token);
    const fetchedUser = await request(app.getHttpServer())
      .get(`/users/${JohnMarston.id}`)
      .send()
      .expect(200);
    // .expect({
    //   ...SampleUser.sampleGetUser(JohnMarston),
    //   isEmailVerified: true,
    // });
    console.log(fetchedUser.body, 'fetched user');
  });

  test('successfull log in', async () => {
    await request(app.getHttpServer()).get('/auth/test').expect(401);
    const loginRequest = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: JohnMarston.email, password: JohnMarston.password })
      .expect(201);
    expect(loginRequest.body.access_token).toBeDefined();
    const token = loginRequest.body.access_token;
    return request(app.getHttpServer())
      .get('/auth/test')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .expect({ id: JohnMarston.id, roles: ['USER'] });
  });
});

describe('/GET', () => {
  test('fetch users sorted and paginated', async () => {
    await userFacade.register(AdrianMonk);
    await userFacade.register(AnakinSkywalker);
    return request(app.getHttpServer())
      .get('/users')
      .query({
        sort: 'fnd',
        offset: 1,
        limit: 1,
      })
      .expect(200)
      .expect([{ ...SampleUser.sampleGetUser(AnakinSkywalker) }]);
  });
});

describe('/PUT', () => {
  test('update user info', async () => {
    await request(app.getHttpServer())
      .put(`/users/${AnakinSkywalker.id}`)
      .send({ firstName: 'Lord', lastName: 'Vader' })
      .expect(200);
    return await request(app.getHttpServer())
      .get(`/users/${AnakinSkywalker.id}`)
      .send()
      .expect(200)
      .expect({
        ...SampleUser.sampleGetUser(AnakinSkywalker),
        firstName: 'Lord',
        lastName: 'Vader',
      });
  });
});

describe('/DELETE', () => {
  test('delete user', async () => {
    await request(app.getHttpServer())
      .del(`/users/${AnakinSkywalker.id}`)
      .expect(200);
    return await request(app.getHttpServer())
      .get(`/users/${AnakinSkywalker.id}`)
      .expect(404);
  });
});

afterAll(async () => {
  (
    await mongo.connect(config.get<string>('DB_URI_TEST'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
  )
    .db(config.get<string>('DB_NAME_TEST'))
    .dropDatabase();
  await app.close();
});
