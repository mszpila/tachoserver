import { AutoMap } from '@automapper/classes';
import { BadRequestException } from '@nestjs/common';
import { Column } from 'typeorm';

export enum UserNameTypes {
  FIRST = 'First',
  LAST = 'Last',
}

export class UserName {
  public static maxLength = 30;
  public static minLength = 2;
  @AutoMap()
  @Column()
  private name: string;

  constructor(name: string, type: UserNameTypes) {
    if (UserName.isValidName(name, type)) {
      this.name = UserName.format(name);
    }
  }

  private static isValidName(name: string, type: UserNameTypes): boolean {
    if (name == '' || name == null || name == undefined) {
      throw new BadRequestException(`${type} name field must be provided`);
    }

    if (name.length < UserName.minLength) {
      throw new BadRequestException(`${type} name is too short`);
    }

    if (name.length > UserName.maxLength) {
      throw new BadRequestException(`${type} name is too long`);
    }

    return true;
  }

  toString(): string {
    return this.name;
  }

  private static format(email: string): string {
    const lowerCase = email.toLowerCase();
    return lowerCase.charAt(0).toUpperCase() + lowerCase.slice(1);
  }
}
