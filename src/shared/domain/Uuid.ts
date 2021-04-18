import { AutoMap } from '@automapper/classes';
import { BadRequestException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import validator from 'validator';
// import { Entity } from "./Entity";

export class Uuid {
  @AutoMap()
  private value: string;

  // public static validator = new RegExp(
  //     /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
  // );

  // constructor(value?: string) {
  //     if (value && Uuid.isUuid(value)) {
  //         this.value = value;
  //     } else {
  //         this.value = uuid();
  //     }
  // }

  constructor(value?: string) {
    if (!value) {
      value = uuid();
    }
    if (!Uuid.isUuid(value)) {
      throw new BadRequestException(
        'Invalid argument; `value` is not a UUID value.',
      );
    }
    this.value = value;
  }

  // static create(id?: string): Uuid {
  //   if (id) {
  //     return Uuid.parse(id);
  //   }
  //   return new Uuid(uuid());
  // }

  // static parse(value: string): Uuid {
  //   if (!Uuid.isUuid(value)) {
  //     throw new TypeError('Invalid argument; `value` is not a UUID value.');
  //   }
  //   return new Uuid(value);
  // }

  static isUuid(value: string): boolean {
    return validator.isUUID(value, 4);
    // return Uuid.validator.test(value);
  }

  toString(): string {
    return this.value;
  }

  toJSON(): JSON {
    return JSON.parse(this.value);
  }

  equals(other: Uuid): boolean {
    return Uuid.isUuid(other.toString()) && this.value === other.toString();
  }

  raw(): string {
    return uuid();
  }
}
