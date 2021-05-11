export interface DomainEventListener {
  handle(event: any): void;
}
