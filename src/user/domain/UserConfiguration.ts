import { InMemoryUserRepository } from './InMemoryUserRepository';
import { UserQueryRepository } from './IUserQueryRepository';
import { UserRepository } from './IUserRepository';
import { UserFacade } from './UserFacade';
// import { UserFactory } from './UserFactory';
import { EventEmitter2 } from '@nestjs/event-emitter';

export class UserConfiguration {
  userFacade(
    userRepository?: UserRepository,
    userQueryRepository?: UserQueryRepository,
    eventEmitter?: EventEmitter2,
  ): UserFacade {
    if (!userRepository || !userQueryRepository) {
      const InMemoryRepository = new InMemoryUserRepository();
      userQueryRepository = InMemoryRepository;
      userRepository = InMemoryRepository;
    }
    if (!eventEmitter) {
      eventEmitter = new EventEmitter2();
    }
    return new UserFacade(userRepository, userQueryRepository, eventEmitter);
  }
}
