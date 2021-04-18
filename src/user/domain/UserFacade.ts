import { PageRequest } from 'src/shared/domain/PageRequest';
import { Uuid } from '../../shared/domain/Uuid';
import { GetUserDto } from './dto/GetUserDto';
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
    const firstName = new UserName(userDto.firstName, UserNameTypes.FIRST);
    const lastName = new UserName(userDto.lastName, UserNameTypes.LAST);
    const email = new UserEmail(userDto.email);
    const password = new UserPassword(userDto.password);
    const id = new Uuid(userDto.id);

    const user: User = new User(id, firstName, lastName, email, password);

    this.userRepository.save(user);
  }

  getById(id: string): GetUserDto | Promise<GetUserDto> {
    const user = this.userQueryRepository.findById(id);
    return UserDto.builder()
      .id(user.id)
      .firstName(user.firstName)
      .lastName(user.lastName)
      .email(user.email)
      .build();
  }

  find(pageRequest: PageRequest): GetUserDto[] | Promise<GetUserDto[]> {
    return this.userQueryRepository.find(pageRequest);
  }
}
