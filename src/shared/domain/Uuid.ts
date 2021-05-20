import { BadRequestException } from '@nestjs/common';
// import { Binary } from 'bson';
import { v4 as uuid } from 'uuid';
// import { from as convertToMUUID, MUUID } from 'uuid-mongodb';
import validator from 'validator';
// import { Entity } from "./Entity";

export class Uuid {
  private id: string;

  constructor(id?: string) {
    if (!id) {
      id = uuid();
    }
    if (!Uuid.isUuid(id)) {
      throw new BadRequestException('Id is not a valid UUID value');
    }
    this.id = id;
  }

  static isUuid(id: string): boolean {
    return validator.isUUID(id, 4);
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

  // toBinary(): MUUID {
  //   // return new Binary(Buffer.from(this.id), 4);
  //   return convertToMUUID(this.id);
  // }

  // static toBinary(id: string): MUUID {
  //   // return new Binary(Buffer.from(id), 4);
  //   return convertToMUUID(id);
  // }
}
