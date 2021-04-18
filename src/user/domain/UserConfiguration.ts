import { InMemoryUserRepository } from './InMemoryUserRepository';
import { UserQueryRepository } from './IUserQueryRepository';
import { UserRepository } from './IUserRepository';
import { UserFacade } from './UserFacade';
// import { UserFactory } from './UserFactory';

export class UserConfiguration {
  userFacade(
    userRepository?: UserRepository,
    userQueryRepository?: UserQueryRepository,
  ): UserFacade {
    if (!userRepository && !userQueryRepository) {
      const InMemoryRepository = new InMemoryUserRepository();
      userQueryRepository = InMemoryRepository;
      userRepository = InMemoryRepository;
      // userRepository = new InMemoryUserRepository();
    }
    // const userFactory: UserFactory = new UserFactory();
    return new UserFacade(
      userRepository,
      userQueryRepository,
      // userFactory
    );
  }
}
