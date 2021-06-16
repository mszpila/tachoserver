import { ConfigService } from '@nestjs/config';
import { Client } from '@sendgrid/client';
import { MailService } from '@sendgrid/mail';
import { EmailVerificationDto } from 'src/email/dto/EmailVerificationDto';
import { EmailConfirmed } from '../../../shared/infrastructure/events/email/EmailEvent';
import { EMAIL_CONFIRMED } from '../../../shared/infrastructure/events/email/EventTopic';
import { DomainEventPublisher } from '../../../shared/infrastructure/events/IDomainEventPublisher';
import { UserRegistered } from '../../../shared/infrastructure/events/user/UserEvent';
import { EmailService } from '../../domain/EmailService';
import { EmailRepository } from '../../domain/IEmailRepository';

export class SendGridService extends EmailService {
  private readonly sendGridClient = new Client();
  private readonly sendGridMailService = new MailService();

  constructor(
    emailRepository: EmailRepository,
    domainEventPublisher: DomainEventPublisher,
    configService: ConfigService,
  ) {
    super(emailRepository, domainEventPublisher, configService);
    this.sendGridClient.setApiKey(
      this.configService.get<string>('SENDGRID_API_KEY'),
    );
    this.sendGridMailService.setClient(this.sendGridClient);
  }

  async sendRegistrationEmail(data: UserRegistered): Promise<string> {
    const { id, email, firstName } = data.getData();
    const token: string = this.createVerificationToken();
    await this.emailRepository.save({ id, token });
    const msg = {
      to: email,
      from: {
        name: 'Tacholife',
        email: this.configService.get<string>('SENDER_EMAIL'),
      },
      templateId: 'd-dd746874951b41698f080612bfbcc9a1',
      dynamicTemplateData: {
        firstName: firstName,
        confirmationUrl: `${this.configService.get<string>(
          'SERVER_URI',
        )}/confirm-email/${token}`,
      },
      mailSettings: {
        sandboxMode: {
          enable: this.configService.get<string>('NODE_ENV') === 'test',
        },
      },
    };
    try {
      await this.sendGridMailService.send(msg, false);
    } catch (error) {
      console.log(error);
    }
    return token;
  }

  async confirmEmail(token: string): Promise<void> {
    const foundDocument: EmailVerificationDto = await this.emailRepository.findByToken(
      token,
    );
    this.domainEventPublisher.publish(
      EMAIL_CONFIRMED,
      new EmailConfirmed({ id: foundDocument.id }),
    );
  }
}
