export interface EmailService {
  sendSingleEmail(data: any): void;
  sendManyEmails(data: any): void;
}
