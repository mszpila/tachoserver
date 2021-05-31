import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { USER_VERIFIED } from '../../../../shared/infrastructure/events/user/EventTopic';
import { DomainEventListener } from '../../../../shared/infrastructure/events/IDomainEventListener';
import { UserFacade } from '../../UserFacade';
import { UserVerified } from '../../../../shared/infrastructure/events/user/UserEvent';
import { EMAIL_CONFIRMED } from '../../../../shared/infrastructure/events/email/EventTopic';
import { EmailConfirmed } from '../../../../shared/infrastructure/events/email/EmailEvent';

@Injectable()
export class UserDomainEventNestListener implements DomainEventListener {
  constructor(private userFacade: UserFacade) {}

  @OnEvent(USER_VERIFIED)
  handle(payload: UserVerified): void {
    this.userFacade.verify(payload);
  }

  @OnEvent(EMAIL_CONFIRMED)
  handleEmailConfirmation(payload: EmailConfirmed): void {
    this.userFacade.confirmEmail(payload.getData().id, true);
  }
}
