import { Module } from '@nestjs/common';
import { MongoDbUserRepository } from './domain/infrastructure/MongoDbUserRepository';
import { UserController } from './domain/infrastructure/UserController';
import { UserQueryRepository } from './domain/IUserQueryRepository';
import { UserRepository } from './domain/IUserRepository';
import { UserConfiguration } from './domain/UserConfiguration';
import { UserFacade } from './domain/UserFacade';
import { DomainEventPublisher } from '../shared/infrastructure/events/IDomainEventPublisher';
import { UserDomainEventNativePublisher } from './domain/infrastructure/UserDomainEventNativePublisher';
import { UserDomainEventNestListener } from './domain/infrastructure/UserDoaminEventNestListener';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/User';

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
  inject: [UserDomainEventNativePublisher, MongoDbUserRepository],
};

@Module({
  imports: [TypeOrmModule.forFeature([User])],
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
