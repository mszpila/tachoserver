import { EventEmitter2 } from 'eventemitter2';
import { UserDomainEventNativeListener } from '../../../../src/user/domain/infrastructure/events/UserDomainEventNativeListener';
import { UserDomainEventNativePublisher } from '../../../../src/user/domain/infrastructure/events/UserDomainEventNativePublisher';
import { UserConfiguration } from '../../../../src/user/domain/UserConfiguration';
import { UserFacade } from '../../../../src/user/domain/UserFacade';

// initializing the user facade for unit test - manual injections
const eventEmitterSingleton = new EventEmitter2();
const eventDomainPublisher = new UserDomainEventNativePublisher(
  eventEmitterSingleton,
);
const userFacade: UserFacade = new UserConfiguration().userFacade(
  eventDomainPublisher,
);
new UserDomainEventNativeListener(userFacade, eventEmitterSingleton);

export { userFacade, eventDomainPublisher };
