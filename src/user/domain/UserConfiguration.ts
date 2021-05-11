import { InMemoryUserRepository } from './InMemoryUserRepository';
import { UserQueryRepository } from './IUserQueryRepository';
import { UserRepository } from './IUserRepository';
import { UserFacade } from './UserFacade';
// import { UserFactory } from './UserFactory';
// import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserUpdater } from './UserUpdater';
import { UserCreator } from './UserCreator';
import { DomainEventPublisher } from '../../shared/infrastructure/events/IDomainEventPublisher';

export class UserConfiguration {
  userFacade(
    domainEventPublisher: DomainEventPublisher,
    userRepository?: UserRepository,
    userQueryRepository?: UserQueryRepository,
  ): UserFacade {
    if (!userRepository || !userQueryRepository) {
      const InMemoryRepository = new InMemoryUserRepository();
      userQueryRepository = InMemoryRepository;
      userRepository = InMemoryRepository;
    }
    const updater: UserUpdater = new UserUpdater(userRepository);
    const creator: UserCreator = new UserCreator();
    return new UserFacade(
      userRepository,
      userQueryRepository,
      domainEventPublisher,
      updater,
      creator,
    );
  }
}
