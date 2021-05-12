// "Data structure should expose its innards and not behavior."
// "DTOs are basically Data structures."
// Inspired by Clean Code by Robert C. Martin(Uncle Bob)
// https://stackoverflow.com/questions/16539238/public-fields-in-a-data-transfer-object

// export class UserDto {
//   id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
//   isVerified: boolean;
// }

export class UserDto {
  readonly id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly password: string;
  readonly isVerified: boolean;

  constructor(
    id = '',
    firstName = '',
    lastName = '',
    email = '',
    password = '',
    isVerified = false,
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.isVerified = isVerified;
  }
}
