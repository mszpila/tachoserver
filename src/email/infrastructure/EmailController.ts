import { Controller, Get, Param } from '@nestjs/common';
import { EmailService } from '../domain/EmailService';

@Controller()
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Get('confirm-email/:token')
  async confirmEmail(@Param('token') token: string): Promise<void> {
    return this.emailService.confirmEmail(token);
  }
}
