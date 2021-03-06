import { Module } from '@nestjs/common';
import { MongoDbUserRepository } from './domain/infrastructure/database/mongodb/MongoDbUserRepository';
import { UserController } from './domain/infrastructure/UserController';
import { UserQueryRepository } from './domain/IUserQueryRepository';
import { UserRepository } from './domain/IUserRepository';
import { UserConfiguration } from './domain/UserConfiguration';
import { UserFacade } from './domain/UserFacade';
import { DomainEventPublisher } from '../shared/infrastructure/events/IDomainEventPublisher';
import { UserDomainEventNativePublisher } from './domain/infrastructure/events/UserDomainEventNativePublisher';
import { UserDomainEventNestListener } from './domain/infrastructure/events/UserDomainEventNestListener';
import { MongoModule } from 'nest-mongodb';

const FacadeConfig = {
  provide: UserFacade,
  useFactory: (
    domainEventPublisher: DomainEventPublisher,
    userRepository: UserRepository,
    userQueryRepository: UserQueryRepository,
  ) => {
    return new UserConfiguration().userFacade(
      domainEventPublisher,
      userRepository,
      userQueryRepository,
    );
  },
  inject: [
    UserDomainEventNativePublisher,
    MongoDbUserRepository,
    MongoDbUserRepository,
  ],
};

@Module({
  imports: [MongoModule.forFeature(['users'])],
  controllers: [UserController],
  providers: [
    UserDomainEventNativePublisher,
    MongoDbUserRepository,
    FacadeConfig,
    UserDomainEventNestListener,
  ],
  exports: [UserFacade],
})
export class UserModule {}
