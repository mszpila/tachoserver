import { DomainEvent } from './IDomainEvent';

export interface DomainEventListener {
  handle(event: DomainEvent): void;
}
