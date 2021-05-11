export class UserUpdateDto {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly password: string;

  constructor(builder: UserUpdateDtoBuilder) {
    this.firstName = builder.getFirstName();
    this.lastName = builder.getLastName();
    this.email = builder.getEmail();
    this.password = builder.getPassword();
  }

  static builder() {
    return new UserUpdateDtoBuilder();
  }
}

class UserUpdateDtoBuilder {
  private firstName = '';
  private lastName = '';
  private email = '';
  private password = '';

  getFirstName(): string {
    return this.firstName;
  }

  getLastName(): string {
    return this.lastName;
  }

  getEmail(): string {
    return this.email;
  }

  getPassword(): string {
    return this.password;
  }

  withFirstName(firstName: string): UserUpdateDtoBuilder {
    this.firstName = firstName;
    return this;
  }

  withLastName(lastName: string): UserUpdateDtoBuilder {
    this.lastName = lastName;
    return this;
  }

  withEmail(email: string): UserUpdateDtoBuilder {
    this.email = email;
    return this;
  }

  withPassword(password: string): UserUpdateDtoBuilder {
    this.password = password;
    return this;
  }

  build(): UserUpdateDto {
    return new UserUpdateDto(this);
  }
}
