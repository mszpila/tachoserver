import { Uuid } from '../../shared/domain/Uuid';
import { FindDto } from './dto/FindDto';
import { LoginDto } from './dto/LoginDto';
import { UserUpdateDto } from './dto/UpdateDto';
import { UserDto } from './dto/UserDto';
import { UserQueryRepository } from './IUserQueryRepository';
import { UserRepository } from './IUserRepository';
import { User } from './User';
import { UserEmail } from './UserEmail';
import { UserName, UserNameTypes } from './UserName';
import { UserPasswordCreator, UserPassword } from './UserPassword';

export class UserFacade {
  constructor(
    private userRepository: UserRepository,
    private userQueryRepository: UserQueryRepository,
  ) {}

  async register(userDto: UserDto): Promise<boolean> {
    const firstName = new UserName(userDto.firstName, UserNameTypes.FIRST);
    const lastName = new UserName(userDto.lastName, UserNameTypes.LAST);
    const email = new UserEmail(userDto.email);
    const password = await new UserPasswordCreator().createUserPassword(
      userDto.password,
    );
    const id = new Uuid(userDto.id);

    const user: User = new User(id, firstName, lastName, email, password);

    return await this.userRepository.save(user);
  }

  async getById(id: string): Promise<UserDto> {
    const user = await this.userQueryRepository.findById(id);
    const userDto = user.toDto();
    return UserDto.builder()
      .id(userDto.id)
      .firstName(userDto.firstName)
      .lastName(userDto.lastName)
      .email(userDto.email)
      .isVerified(userDto.isVerified)
      .build();
  }

  async find(query: FindDto): Promise<UserDto[]> {
    switch (query.sort) {
      case 'fna':
        query.sort = { firstName: 1 };
        break;
      case 'fnd':
        query.sort = { firstName: -1 };
        break;
      case 'lna':
        query.sort = { lastName: 1 };
        break;
      case 'lnd':
        query.sort = { lastName: -1 };
        break;
      default:
        query.sort = { firstName: 1 };
        break;
    }

    query.name = query.name ? query.name.toLowerCase() : '';
    // query.lastName = query.lastName || '';
    // query.isVerified = query.isVerified ? true : false;
    query.offset = query.offset || 0;
    query.limit = query.limit || 20;
    const users = await this.userQueryRepository.find(query);
    const usersArray: UserDto[] = [];
    for (const user of users) {
      // usersArray.push(user.toDto());
      const userDto = user.toDto();
      usersArray.push(
        UserDto.builder()
          .id(userDto.id)
          .firstName(userDto.firstName)
          .lastName(userDto.lastName)
          .email(userDto.email)
          .isVerified(userDto.isVerified)
          .build(),
      );
    }
    return usersArray;
  }

  async submitVerification(id: string): Promise<any> {
    //
  }
  async confirmVerification(id: string): Promise<any> {
    //
  }

  async login(login: LoginDto): Promise<boolean> {
    const foundUser = await this.userQueryRepository.findByEmail(login.email);
    return await UserPassword.comparePassword(
      login.password,
      foundUser.toDto().password,
    );
  }

  async update(id: string, userUpdateDto: UserUpdateDto): Promise<boolean> {
    const user = await this.userQueryRepository.findById(id);

    const updatedUser = userUpdateDto.password
      ? user.update(
          new Uuid(id),
          new UserName(
            userUpdateDto.firstName || user.toDto().firstName,
            UserNameTypes.FIRST,
          ),
          new UserName(
            userUpdateDto.lastName || user.toDto().lastName,
            UserNameTypes.LAST,
          ),
          new UserEmail(userUpdateDto.email || user.toDto().email),
          await new UserPasswordCreator().createUserPassword(
            userUpdateDto.password,
          ),
        )
      : user.update(
          new Uuid(id),
          new UserName(
            userUpdateDto.firstName || user.toDto().firstName,
            UserNameTypes.FIRST,
          ),
          new UserName(
            userUpdateDto.lastName || user.toDto().lastName,
            UserNameTypes.LAST,
          ),
          new UserEmail(userUpdateDto.email || user.toDto().email),
        );

    return await this.userRepository.findAndUpdate(id, updatedUser);
  }

  async deleteById(id: string): Promise<boolean> {
    return await this.userRepository.delete(id);
  }
}
