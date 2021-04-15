// "Data structure should expose its innards and not behavior."
// "DTOs are basically Data structures."
// Inspired by Clean Code by Robert C. Martin(Uncle Bob)
// https://stackoverflow.com/questions/16539238/public-fields-in-a-data-transfer-object

export class UserDto {
  public id: string;
  public firstName: string;
  public lastName: string;
  public email: string;
  public password: string;

  static builder(): UserDtoBuilder {
    return new UserDtoBuilder();
  }
}

export class UserDtoBuilder {
  private _id: string;
  private _firstName: string;
  private _lastName: string;
  private _email: string;
  private _password: string;

  id(id: string): UserDtoBuilder {
    this._id = id;
    return this;
  }

  firstName(firstName: string): UserDtoBuilder {
    this._firstName = firstName;
    return this;
  }

  lastName(lastName: string): UserDtoBuilder {
    this._lastName = lastName;
    return this;
  }

  email(email: string): UserDtoBuilder {
    this._email = email;
    return this;
  }

  password(password: string): UserDtoBuilder {
    this._password = password;
    return this;
  }

  build(): UserDto {
    // implement the Mapper!
    const userDto = new UserDto();
    userDto.id = this._id;
    userDto.firstName = this._firstName;
    userDto.lastName = this._lastName;
    userDto.email = this._email;
    userDto.password = this._password;
    return userDto;
  }
}
