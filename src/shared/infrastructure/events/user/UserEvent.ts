import { DomainEvent } from '../IDomainEvent';

interface UserVerificationRequestData {
  id: string;
  frontUrl: string;
  backUrl: string;
  selfieUrl: string;
}

export class UserVerificationRequest implements DomainEvent {
  constructor(private data: UserVerificationRequestData) {}

  getData(): UserVerificationRequestData {
    return this.data;
  }
}

interface UserVerifiedData {
  id: string;
  isVerified: boolean;
}

export class UserVerified implements DomainEvent {
  constructor(private data: UserVerifiedData) {}

  getData(): UserVerifiedData {
    return this.data;
  }
}

interface UserRegisteredData {
  firstName: string;
  email: string;
}

export class UserRegistered implements DomainEvent {
  constructor(private data: UserRegisteredData) {}

  getData(): UserRegisteredData {
    return this.data;
  }
}
