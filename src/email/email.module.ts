import { Module } from '@nestjs/common';
import { EmailServiceNestListener } from './infrastructure/events/EmailServiceNestListener';
import { EmailService } from './domain/EmailService';
import { ConfigService } from '@nestjs/config';
import { SendGridService } from './infrastructure/smtp/SendGridService';
import { EmailRepository } from './domain/IEmailRepository';
import { DomainEventPublisher } from 'src/shared/infrastructure/events/IDomainEventPublisher';
import { MongoDbEmailRepository } from './infrastructure/database/mongodb/MongoDbEmailRepository';
import { EmailDomainEventNativePublisher } from './infrastructure/events/EmailServiceNativePublisher';
import { MongoModule } from 'nest-mongodb';
import { EmailController } from './infrastructure/EmailController';

const EmailServiceConfig = {
  provide: EmailService,
  inject: [
    MongoDbEmailRepository,
    EmailDomainEventNativePublisher,
    ConfigService,
  ],
  useFactory: (
    emailRepository: EmailRepository,
    domainEventPublisher: DomainEventPublisher,
    configService: ConfigService,
  ) => {
    return new SendGridService(
      emailRepository,
      domainEventPublisher,
      configService,
    );
  },
};

const EmailListenerConfig = {
  provide: EmailServiceNestListener,
  inject: [EmailService],
  useFactory: (emailService: EmailService) => {
    return new EmailServiceNestListener(emailService);
  },
};

@Module({
  imports: [MongoModule.forFeature(['verification_tokens'])],
  controllers: [EmailController],
  providers: [
    MongoDbEmailRepository,
    EmailDomainEventNativePublisher,
    ConfigService,
    EmailServiceConfig,
    EmailListenerConfig,
  ],
})
export class EmailModule {}
