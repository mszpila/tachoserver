import { OAuthUserDto } from 'src/shared/authentication';
import { UserUpdateDto } from './dto/UserUpdateDto';
import { UserRepository } from './IUserRepository';
import { User } from './User';
import { UserEmail } from './UserEmail';
import { UserName, UserNameTypes } from './UserName';
import { UserPassword } from './UserPassword';
import { UserSnapshot } from './UserSnapshot';

export class UserUpdater {
  constructor(private userRepository: UserRepository) {}

  async update(id: string, userUpdateDto: UserUpdateDto): Promise<boolean> {
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
    if (userUpdateDto.email && !user.getOAuthId()) {
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

  async fromOAuth(oauthDto: OAuthUserDto, user: User): Promise<UserSnapshot> {
    if (
      oauthDto.firstName !== user.getFirstName() ||
      oauthDto.lastName !== user.getLastName()
    ) {
      user.setFirstName(new UserName(oauthDto.firstName, UserNameTypes.FIRST));
      user.setLastName(new UserName(oauthDto.lastName, UserNameTypes.LAST));
      await this.userRepository.update(user);
    }
    return user.toSnapShot();
  }
}
