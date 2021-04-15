import { Module } from '@nestjs/common';
import { MongoDbUserRepository } from './domain/infrastructure/MongoDbUserRepository';
import { UserController } from './domain/infrastructure/UserController';
import { UserQueryRepository } from './domain/IUserQueryRepository';
import { UserRepository } from './domain/IUserRepository';
import { UserConfiguration } from './domain/UserConfiguration';
import { UserFacade } from './domain/UserFacade';

const FacadeConfig = {
  provide: UserFacade,
  useFactory: (
    userRepository: UserRepository,
    userQueryRepository: UserQueryRepository,
  ) => {
    return new UserConfiguration().userFacade(
      userRepository,
      userQueryRepository,
    );
  },
  inject: [MongoDbUserRepository],
};

@Module({
  controllers: [UserController],
  providers: [FacadeConfig, MongoDbUserRepository],
})
export class UserModule {}
