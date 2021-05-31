import { EmailService } from '../../domain/IEmailService';
import { Client } from '@sendgrid/client';
import { MailService } from '@sendgrid/mail';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SendGrid implements EmailService {
  private readonly sendGridClient = new Client();
  private readonly sendGridMailService = new MailService();

  constructor(private readonly configService: ConfigService) {
    this.sendGridClient.setApiKey(
      this.configService.get<string>('SENDGRID_API_KEY'),
    );
    this.sendGridMailService.setClient(this.sendGridClient);
  }

  async sendSingleEmail(data: any): Promise<void> {
    const msg = {
      to: data.email,
      from: {
        name: 'Tacholife',
        email: this.configService.get<string>('SENDER_EMAIL'),
      },
      templateId: 'd-dd746874951b41698f080612bfbcc9a1',
      dynamicTemplateData: {
        firstName: data.firstName,
        confirmationUrl: 'http://google.com',
      },
      mail_settings: {
        sandbox_mode:
          this.configService.get<string>('NODE_ENVIRONMENT') === 'test',
      },
    };
    try {
      await this.sendGridMailService.send(msg, false);
    } catch (error) {
      console.log(error);
    }
  }

  sendMultipleEmails(data: any): void {
    throw new Error('Method not implemented.');
  }
}
