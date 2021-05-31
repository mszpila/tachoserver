import { DomainEvent } from '../IDomainEvent';

interface EmailConfirmedData {
  id: string;
}

export class EmailConfirmed implements DomainEvent {
  constructor(private data: EmailConfirmedData) {}

  getData(): EmailConfirmedData {
    return this.data;
  }
}
