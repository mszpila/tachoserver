import { ConfigService } from '@nestjs/config';
import { DomainEventPublisher } from '../../shared/infrastructure/events/IDomainEventPublisher';
import { EmailRepository } from './IEmailRepository';
import * as crypto from 'crypto';
import { Injectable } from '@nestjs/common';
import { UserRegistered } from '../../shared/infrastructure/events/user/UserEvent';

@Injectable()
export abstract class EmailService {
  abstract sendRegistrationEmail(payload: UserRegistered): Promise<string>;
  abstract confirmEmail(token: string): Promise<void>;

  constructor(
    protected emailRepository: EmailRepository,
    protected domainEventPublisher: DomainEventPublisher,
    protected configService: ConfigService,
  ) {}

  protected createVerificationToken(): string {
    return crypto.randomBytes(128).toString('hex');
  }
}
