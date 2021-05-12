import { EventEmitter2 } from '@nestjs/event-emitter';
import { USER_VERIFIED } from '../../../shared/infrastructure/events/user/EventTopic';
import { DomainEventListener } from '../../../shared/infrastructure/events/IDomainEventListener';
import { UserFacade } from '../UserFacade';
import { UserVerified } from '../../../shared/infrastructure/events/user/UserEvent';

export class UserDomainEventNativeListener implements DomainEventListener {
  constructor(
    private userFacade: UserFacade,
    private nativeEventEmitter: EventEmitter2,
  ) {
    this.nativeEventEmitter.on(USER_VERIFIED, (payload: UserVerified) => {
      this.handle(payload);
    });
  }

  handle(payload: UserVerified): void {
    this.userFacade.verify(payload);
  }
}
