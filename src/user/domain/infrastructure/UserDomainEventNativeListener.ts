import { EventEmitter2 } from '@nestjs/event-emitter';
import { USER_VERIFIED } from '../../../shared/infrastructure/events/EventTopic';
import { DomainEventListener } from '../../../shared/infrastructure/events/IDomainEventListener';
import { UserFacade } from '../UserFacade';

export class UserDomainEventNativeListener implements DomainEventListener {
  constructor(
    private userFacade: UserFacade,
    private nativeEventEmitter: EventEmitter2,
  ) {
    this.nativeEventEmitter.on(USER_VERIFIED, (payload: any) => {
      this.handle(payload);
    });
  }

  handle(payload: any): void {
    this.userFacade.verify(payload);
  }
}
