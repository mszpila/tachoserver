import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { USER_VERIFIED } from '../../../shared/infrastructure/events/EventTopic';
import { DomainEventListener } from '../../../shared/infrastructure/events/IDomainEventListener';
import { UserFacade } from '../UserFacade';

@Injectable()
export class UserDomainEventNestListener implements DomainEventListener {
  constructor(private userFacade: UserFacade) {}

  @OnEvent(USER_VERIFIED)
  handle(payload: any): void {
    this.userFacade.verify(payload);
  }
}
