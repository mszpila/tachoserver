import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DomainEvent } from 'src/shared/infrastructure/events/IDomainEvent';
import { DomainEventPublisher } from '../../../shared/infrastructure/events/IDomainEventPublisher';

@Injectable()
export class UserDomainEventNativePublisher implements DomainEventPublisher {
  constructor(private nativeEventEmitter: EventEmitter2) {}
  publish(eventTopic: string, event: DomainEvent): void {
    this.nativeEventEmitter.emit(eventTopic, event);
  }
}
