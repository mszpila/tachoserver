import { BadRequestException } from '@nestjs/common';

export class UserEmail {
  private email: string;

  constructor(email: string) {
    if (UserEmail.isValidEmail(email)) {
      this.email = UserEmail.format(email);
    }
  }

  private static isValidEmail(email: string): boolean {
    if (
      !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email,
      )
    ) {
      throw new BadRequestException('Email address is not valid');
    }
    return true;
  }

  private static format(email: string): string {
    return email.trim().toLowerCase();
  }

  toString(): string {
    return this.email;
  }
}
