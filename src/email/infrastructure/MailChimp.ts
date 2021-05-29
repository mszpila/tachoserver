import { EmailService } from '../IEmailService';

export class MailChimp implements EmailService {
  sendSingleEmail(data: any): void {
    throw new Error('Method not implemented.');
  }
  sendManyEmails(data: any): void {
    throw new Error('Method not implemented.');
  }
}
