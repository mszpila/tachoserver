import { EmailService } from '../../domain/IEmailService';

export class MailChimp implements EmailService {
  sendSingleEmail(data: any): void {
    throw new Error('Method not implemented.');
  }
  sendMultipleEmails(data: any): void {
    throw new Error('Method not implemented.');
  }
}
