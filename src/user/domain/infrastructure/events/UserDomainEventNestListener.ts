import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { USER_VERIFIED } from '../../../../shared/infrastructure/events/user/EventTopic';
import { DomainEventListener } from '../../../../shared/infrastructure/events/IDomainEventListener';
import { UserFacade } from '../../UserFacade';
import { UserVerified } from '../../../../shared/infrastructure/events/user/UserEvent';

@Injectable()
export class UserDomainEventNestListener implements DomainEventListener {
  constructor(private userFacade: UserFacade) {}

  @OnEvent(USER_VERIFIED)
  handle(payload: UserVerified): void {
    this.userFacade.verify(payload);
  }
}
