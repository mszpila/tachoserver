import { Injectable } from '@nestjs/common';
import { EmailService } from '../../domain/IEmailService';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import Registration from '../../templates/Registration.js';

@Injectable()
export class Nodemailer implements EmailService {
  private readonly transporter: Transporter = nodemailer.createTransport({
    // https://nodemailer.com/smtp/oauth2/
    host: process.env.MAIL_SMTP,
    port: 465,
    secure: true,
    auth: {
      type: 'OAuth2',
      user: process.env.MAIL_USERNAME,
      clientId: process.env.OAUTH_CLIENTID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN,
    },
  });

  sendSingleEmail(data: any): void {
    this.transporter.sendMail(this.prepareEmail(data));
  }

  async sendMultipleEmails(data: any): Promise<void> {
    const selectedGroupOfUsers = [];
    selectedGroupOfUsers.forEach(
      await this.transporter.sendMail(this.prepareEmail(data)),
    );
  }

  private prepareEmail(data: any): unknown {
    return {
      from: 'Sender Name <sender@server.com>',
      to: data.email,
      subject: 'Registration',
      html: Registration(data.firstName),
    };
  }
}
