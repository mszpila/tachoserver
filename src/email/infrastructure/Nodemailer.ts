import { Injectable } from '@nestjs/common';
import { EmailService } from '../IEmailService';

@Injectable()
export class Nodemailer implements EmailService {
  sendSingleEmail(data: any): void {
    throw new Error('Method not implemented.');
  }
  sendManyEmails(data: any): void {
    throw new Error('Method not implemented.');
  }
}
