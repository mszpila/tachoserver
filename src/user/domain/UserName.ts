import { BadRequestException } from '@nestjs/common';

export enum UserNameTypes {
  FIRST = 'First',
  LAST = 'Last',
}

export class UserName {
  public static maxLength = 30;
  public static minLength = 2;

  private constructor(private name: string) {}

  public static create(name: string, type: UserNameTypes): UserName {
    if (name == '' || name == null || name == undefined) {
      throw new BadRequestException(`${type} name field must be provided`);
    }

    if (name.length < this.minLength) {
      throw new BadRequestException(`${type} name is too short`);
    }

    if (name.length > this.maxLength) {
      throw new BadRequestException(`${type} name is too long`);
    }

    return new UserName(name);
  }

  toString(): string {
    return this.name;
  }
}
