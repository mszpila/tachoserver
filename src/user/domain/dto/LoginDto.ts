// export class LoginDto {
//   email: string;
//   password: string;
// }

export class LoginDto {
  readonly email: string;
  readonly password: string;

  constructor(email = '', password = '') {
    this.email = email;
    this.password = password;
  }
}
