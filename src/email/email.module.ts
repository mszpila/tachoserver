import { Module } from '@nestjs/common';
import { EmailServiceNestListener } from './EmailServiceNestListener';
import { EmailService } from './IEmailService';
import { Nodemailer } from './infrastructure/Nodemailer';

const emailService = {
  provide: EmailServiceNestListener,
  useFactory: (emailService: EmailService) => {
    return new EmailServiceNestListener(emailService);
  },
  inject: [Nodemailer],
};

@Module({
  providers: [emailService],
})
export class EmailModule {}
