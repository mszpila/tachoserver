import { DomainEvent } from './IDomainEvent';

export interface DomainEventPublisher {
  publish(eventTopic: string, event: DomainEvent): void;
}
