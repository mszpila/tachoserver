export class DomainEvent {
  private readonly topic: string;
  private readonly message: any;

  constructor(topic: string, message: any) {
    this.topic = topic;
    this.message = message;
  }

  getTopic(): string {
    return this.topic;
  }

  getMessage() {
    return this.message;
  }
}
