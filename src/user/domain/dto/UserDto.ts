// "Data structure should expose its innards and not behavior."
// "DTOs are basically Data structures."
// Inspired by Clean Code by Robert C. Martin(Uncle Bob)
// https://stackoverflow.com/questions/16539238/public-fields-in-a-data-transfer-object

import { AutoMap } from '@automapper/classes';

export class UserDto {
  @AutoMap()
  public id: string;
  @AutoMap()
  public firstName: string;
  @AutoMap()
  public lastName: string;
  @AutoMap()
  public email: string;
  @AutoMap()
  public password: string;
  @AutoMap()
  public isVerified: boolean;

  constructor(builder: UserDtoBuilder) {
    this.id = builder.id;
    this.firstName = builder.firstName;
    this.lastName = builder.lastName;
    this.email = builder.email;
    this.password = builder.password;
    this.isVerified = builder.isVerified;
  }

  static builder(): UserDtoBuilder {
    return new UserDtoBuilder();
  }
}

export class UserDtoBuilder {
  public id: string;
  public firstName: string;
  public lastName: string;
  public email: string;
  public password: string;
  public isVerified: boolean;

  withId(id: string): UserDtoBuilder {
    this.id = id;
    return this;
  }

  withFirstName(firstName: string): UserDtoBuilder {
    this.firstName = firstName;
    return this;
  }

  withLastName(lastName: string): UserDtoBuilder {
    this.lastName = lastName;
    return this;
  }

  withEmail(email: string): UserDtoBuilder {
    this.email = email;
    return this;
  }

  withPassword(password: string): UserDtoBuilder {
    this.password = password;
    return this;
  }

  withIsVerified(isVerified: boolean): UserDtoBuilder {
    this.isVerified = isVerified;
    return this;
  }

  build(): UserDto {
    // implement the Mapper!
    return new UserDto(this);
    // const userDto = new UserDto();
    // const keys = Object.keys(this);
    // keys.forEach((key) => {
    //   if (key) {
    //     userDto[key] = this[key];
    //   }
    // });
    // return userDto;
  }
}
