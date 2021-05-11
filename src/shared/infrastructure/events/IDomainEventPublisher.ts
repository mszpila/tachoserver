import { DomainEvent } from './DomainEvent';

export interface DomainEventPublisher {
  publish(event: DomainEvent): void;
  // subscribe(topic: string, callback: (payload: any) => void): void;
}
