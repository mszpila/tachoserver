import { UserUpdateDto } from './dto/UserUpdateDto';
import { UserRepository } from './IUserRepository';
import { UserEmail } from './UserEmail';
import { UserName, UserNameTypes } from './UserName';
import { UserPassword } from './UserPassword';

export class UserUpdater {
  constructor(private userRepository: UserRepository) {}

  async execute(id: string, userUpdateDto: UserUpdateDto): Promise<boolean> {
    const user = await this.userRepository.findById(id);
    if (userUpdateDto.firstName) {
      const firstName: UserName = new UserName(
        userUpdateDto.firstName,
        UserNameTypes.FIRST,
      );
      user.setFirstName(firstName);
    }
    if (userUpdateDto.lastName) {
      const lastName: UserName = new UserName(
        userUpdateDto.lastName,
        UserNameTypes.LAST,
      );
      user.setLastName(lastName);
    }
    if (userUpdateDto.email) {
      const email: UserEmail = new UserEmail(userUpdateDto.email);
      user.setEmail(email);
    }
    if (userUpdateDto.password) {
      const password = await UserPassword.createPassword(
        userUpdateDto.password,
      );
      user.setPassword(password);
    }

    return await this.userRepository.update(user);
  }
}
