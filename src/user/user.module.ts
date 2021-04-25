import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongoDbUserRepository } from './domain/infrastructure/MongoDbUserRepository';
import { UserController } from './domain/infrastructure/UserController';
import { UserQueryRepository } from './domain/IUserQueryRepository';
import { UserRepository } from './domain/IUserRepository';
import { User } from './domain/User';
import { UserConfiguration } from './domain/UserConfiguration';
import { UserFacade } from './domain/UserFacade';
// import { Profile, ProfileBase } from 'nestjsx-automapper';
import { EventEmitter2 } from '@nestjs/event-emitter';

// @Profile('usesrMapper')
// class UserProfile extends ProfileBase {}

const FacadeConfig = {
  provide: UserFacade,
  useFactory: (
    userRepository: UserRepository,
    userQueryRepository: UserQueryRepository,
    eventEmitter: EventEmitter2,
  ) => {
    return new UserConfiguration().userFacade(
      userRepository,
      userQueryRepository,
      eventEmitter,
    );
  },
  inject: [MongoDbUserRepository, EventEmitter2],
};

@Module({
  // imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [FacadeConfig, MongoDbUserRepository],
})
export class UserModule {}
