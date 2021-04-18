import { AutoMap } from '@automapper/classes';
import { BadRequestException } from '@nestjs/common';

export enum UserNameTypes {
  FIRST = 'First',
  LAST = 'Last',
}

export class UserName {
  public static maxLength = 30;
  public static minLength = 2;
  @AutoMap()
  private name: string;

  constructor(name: string, type: UserNameTypes) {
    if (name == '' || name == null || name == undefined) {
      throw new BadRequestException(`${type} name field must be provided`);
    }

    if (name.length < UserName.minLength) {
      throw new BadRequestException(`${type} name is too short`);
    }

    if (name.length > UserName.maxLength) {
      throw new BadRequestException(`${type} name is too long`);
    }
    this.name = name;
  }

  // public static create(name: string, type: UserNameTypes): UserName {
  //   if (name == '' || name == null || name == undefined) {
  //     throw new BadRequestException(`${type} name field must be provided`);
  //   }

  //   if (name.length < this.minLength) {
  //     throw new BadRequestException(`${type} name is too short`);
  //   }

  //   if (name.length > this.maxLength) {
  //     throw new BadRequestException(`${type} name is too long`);
  //   }

  //   return new UserName(name);
  // }

  toString(): string {
    return this.name;
  }
}
