import { Uuid } from '../../shared/domain/Uuid';
import { UserDto } from './dto/UserDto';
import { UserQueryRepository } from './IUserQueryRepository';
import { UserRepository } from './IUserRepository';
import { User } from './User';
import { UserEmail } from './UserEmail';
import { UserName, UserNameTypes } from './UserName';
import { UserPassword } from './UserPassword';
// import { UserFactory } from './UserFactory';

export class UserFacade {
  constructor(
    private userRepository: UserRepository, // private userFactory: UserFactory,
    private userQueryRepository: UserQueryRepository,
  ) {}

  register(userDto: UserDto): void {
    const firstName = UserName.create(userDto.firstName, UserNameTypes.FIRST);
    const lastName = UserName.create(userDto.lastName, UserNameTypes.LAST);
    const email = UserEmail.create(userDto.email);
    const password = UserPassword.create(userDto.password);
    const id = Uuid.create(userDto.id);

    const user: User = User.create(firstName, lastName, email, password, id);

    this.userRepository.save(user);
  }

  getUser(id: string): UserDto | Promise<UserDto> {
    return this.userQueryRepository.findById(id);
  }
}
