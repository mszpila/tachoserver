import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { USER_REGISTERED } from '../shared/infrastructure/events/user/EventTopic';
import { DomainEventListener } from '../shared/infrastructure/events/IDomainEventListener';
import { EmailService } from './IEmailService';
import { UserRegistered } from '../shared/infrastructure/events/user/UserEvent';

@Injectable()
export class EmailServiceNestListener implements DomainEventListener {
  constructor(private emailService: EmailService) {}

  @OnEvent(USER_REGISTERED)
  handle(payload: UserRegistered): void {
    this.emailService.sendSingleEmail(payload);
  }
}
