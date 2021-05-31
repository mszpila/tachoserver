import { EventEmitter2 } from 'eventemitter2';
import { USER_REGISTERED } from '../../../shared/infrastructure/events/user/EventTopic';
import { DomainEventListener } from '../../../shared/infrastructure/events/IDomainEventListener';
import { UserRegistered } from '../../../shared/infrastructure/events/user/UserEvent';
import { EmailService } from '../../domain/EmailService';

export class EmailServiceNativeListener implements DomainEventListener {
  constructor(
    private readonly emailService: EmailService,
    private readonly nativeEventEmitter: EventEmitter2,
  ) {
    this.nativeEventEmitter.on(USER_REGISTERED, (payload: UserRegistered) => {
      this.handle(payload);
    });
  }

  handle(payload: UserRegistered): void {
    this.emailService.sendRegistrationEmail(payload);
  }
}
