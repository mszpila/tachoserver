export interface EmailService {
  sendSingleEmail(data: any): void;
  sendMultipleEmails(data: any): void;
}
