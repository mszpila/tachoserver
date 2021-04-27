import { UserUpdateDto } from './dto/UpdateDto';
import { UserRepository } from './IUserRepository';
import { User } from './User';
import { UserBuilder } from './UserBuilder';

export class UserUpdater {
  private toUpdate: UserBuilder | Promise<UserBuilder>;

  constructor(private userRepository: UserRepository) {}

  async execute(id: string, userUpdateDto: UserUpdateDto) {
    const user = await this.userRepository.findById(id);
    if (userUpdateDto.firstName) {
      this.toUpdate = (await user.toBuilder()).withFirstName(
        userUpdateDto.firstName,
      );
    }
    if (userUpdateDto.lastName) {
      this.toUpdate = (await user.toBuilder()).withLastName(
        userUpdateDto.lastName,
      );
    }
    if (userUpdateDto.email) {
      this.toUpdate = (await user.toBuilder()).withEmail(userUpdateDto.email);
    }
    if (userUpdateDto.password) {
      this.toUpdate = await (await user.toBuilder()).withPassword(
        userUpdateDto.password,
      );
    }
    return await this.userRepository.update(await this.toUpdate.build());
  }
}
