import { AutoMap } from '@automapper/classes';
import { BadRequestException } from '@nestjs/common';
import { ObjectIdColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';
import validator from 'validator';
// import { Entity } from "./Entity";

export class Uuid {
  @AutoMap()
  @ObjectIdColumn()
  private id: string;

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

  constructor(id?: string) {
    if (!id) {
      id = uuid();
    }
    if (!Uuid.isUuid(id)) {
      throw new BadRequestException('Id is not a valid UUID value');
    }
    this.id = id;
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

  static isUuid(id: string): boolean {
    return validator.isUUID(id, 4);
    // return Uuid.validator.test(id);
  }

  toString(): string {
    return this.id;
  }

  toJSON(): JSON {
    return JSON.parse(this.id);
  }

  equals(other: Uuid): boolean {
    return Uuid.isUuid(other.toString()) && this.id === other.toString();
  }

  raw(): string {
    return uuid();
  }
}
