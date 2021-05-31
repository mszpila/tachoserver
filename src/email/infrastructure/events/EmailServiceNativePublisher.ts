import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from 'eventemitter2';
import { DomainEvent } from 'src/shared/infrastructure/events/IDomainEvent';
import { DomainEventPublisher } from 'src/shared/infrastructure/events/IDomainEventPublisher';

@Injectable()
export class EmailDomainEventNativePublisher implements DomainEventPublisher {
  constructor(private nativeEventEmitter: EventEmitter2) {}
  publish(eventTopic: string, event: DomainEvent): void {
    this.nativeEventEmitter.emit(eventTopic, event);
  }
}
