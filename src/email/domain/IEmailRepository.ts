import { EmailVerificationDto } from '../dto/EmailVerificationDto';

export interface EmailRepository {
  save(data: EmailVerificationDto): Promise<void>;
  findByToken(token: string): Promise<EmailVerificationDto>;
}
