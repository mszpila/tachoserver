import { BadRequestException } from '@nestjs/common';

export class UserEmail {
  private email: string;

  private constructor(email: string) {
    this.email = email;
  }

  private static isValidEmail(email: string) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  private static format(email: string): string {
    return email.trim().toLowerCase();
  }

  public static create(email: string): UserEmail {
    if (!this.isValidEmail(email)) {
      throw new BadRequestException('Email address is not valid');
    } else {
      return new UserEmail(this.format(email));
    }
  }

  toString(): string {
    return this.email;
  }
}
