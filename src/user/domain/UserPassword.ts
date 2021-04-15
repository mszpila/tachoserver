// import * as bcrypt from 'bcrypt-nodejs';

export class UserPassword {
  public static minLength = 6;

  private hashedPassword: string;

  private constructor(password: string) {
    this.hashedPassword = password;
  }

  // private static isAppropriateLength(password: string): boolean {
  //   return password.length >= this.minLength;
  // }

  // /**
  //  * @method comparePassword
  //  * @desc Compares as plain-text and hashed password.
  //  */

  // public async comparePassword(plainTextPassword: string): Promise<boolean> {
  //   if (this.isAlreadyHashed()) {
  //     return this.bcryptCompare(plainTextPassword, this.hashedPassword);
  //   } else {
  //     return this.password === plainTextPassword;
  //   }
  // }

  // private bcryptCompare(plainText: string, hashed: string): Promise<boolean> {
  //   return new Promise((resolve, reject) => {
  //     bcrypt.compare(plainText, hashed, (err, compareResult) => {
  //       if (err) return resolve(false);
  //       return resolve(compareResult);
  //     });
  //   });
  // }

  // public isAlreadyHashed(): boolean {
  //   return this.props.hashed;
  // }

  // private hashPassword(password: string): Promise<string> {
  //   return new Promise((resolve, reject) => {
  //     bcrypt.hash(password, null, null, (err, hash) => {
  //       if (err) return reject(err);
  //       resolve(hash);
  //     });
  //   });
  // }

  // public getHashedValue(): Promise<string> {
  //   return new Promise((resolve) => {
  //     if (this.isAlreadyHashed()) {
  //       return resolve(this.props.value);
  //     } else {
  //       return resolve(this.hashPassword(this.props.value));
  //     }
  //   });
  // }

  public static create(plainTextPassword: string): UserPassword {
    // const propsResult = Guard.againstNullOrUndefined(props.value, 'password');
    return new UserPassword(plainTextPassword);
  }
}
