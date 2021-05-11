import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DomainEvent } from 'src/shared/infrastructure/events/DomainEvent';
import { DomainEventPublisher } from '../../../shared/infrastructure/events/IDomainEventPublisher';

@Injectable()
export class UserDomainEventNativePublisher implements DomainEventPublisher {
  constructor(private nativeEventEmitter: EventEmitter2) {}
  publish(event: DomainEvent): void {
    this.nativeEventEmitter.emit(event.getTopic(), event.getMessage());
  }
}
