import * as bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';

export class UserPassword {
  private hashedPassword: string;

  constructor(password: string) {
    this.hashedPassword = password;
  }

  static async comparePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const result = await bcrypt.compare(plainPassword, hashedPassword);
    if (!result) {
      throw new BadRequestException('Wrong credentials');
    }
    return result;
  }

  toString(): string {
    return this.hashedPassword;
  }
}

export class UserPasswordCreator {
  async createUserPassword(password: string): Promise<UserPassword> {
    if (UserPasswordCreator.isValidPassword(password)) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      return new UserPassword(hashedPassword);
    }
  }

  private static isValidPassword(password: string): boolean {
    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[?!@#\$%\^&\*-])(?=.{8,})/.test(
        password,
      )
    ) {
      throw new BadRequestException('Password is not valid');
    }
    return true;
  }
}
