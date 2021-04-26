import { BadRequestException } from '@nestjs/common';
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
import { UserPassword } from './UserPassword';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { UploadDocumentDto } from './dto/UploadDocumentDto';

export class UserFacade {
  constructor(
    private userRepository: UserRepository,
    private userQueryRepository: UserQueryRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async register(userDto: UserDto): Promise<boolean> {
    const { id, firstName, lastName, email, password } = userDto;
    const user: User = (
      await User.builder()
        .id(id)
        .firstName(firstName)
        .lastName(lastName)
        .email(email)
        .password(password)
    ).build();

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

  async login(login: LoginDto): Promise<boolean> {
    const foundUser = await this.userQueryRepository.findByEmail(login.email);
    return await UserPassword.comparePassword(
      login.password,
      foundUser.toDto().password,
    );
  }

  async update(id: string, userUpdateDto: UserUpdateDto): Promise<boolean> {
    const user = await this.userQueryRepository.findById(id);
    for (const prop of Object.keys(userUpdateDto)) {
      await user[`set${prop.charAt(0).toUpperCase() + prop.slice(1)}`](
        userUpdateDto[prop],
      );
    }

    return await this.userRepository.update(user);
  }

  async deleteById(id: string): Promise<boolean> {
    return await this.userRepository.delete(id);
  }

  async submitVerification(
    id: string,
    upload: UploadDocumentDto,
  ): Promise<boolean> {
    const user = await this.userQueryRepository.findById(id);
    const isVerified = user.toDto().isVerified;
    if (isVerified) {
      throw new BadRequestException('User already verified');
    }
    return this.eventEmitter.emit(
      'verification request',
      {
        userId: id,
        frontUrl: upload.frontUrl,
        backUrl: upload.backUrl,
        selfieUrl: upload.selfieUrl,
      },
      console.log('working'),
    );
  }

  @OnEvent('user verified', { async: true })
  async verify(payload: any): Promise<boolean> {
    const user = await this.userQueryRepository.findById(payload.id);
    user.setIsVerified(payload.isVerified);
    return await this.userRepository.update(user);
  }

  async confirmEmail(id: string, isEmailVerified: boolean): Promise<boolean> {
    const user = await this.userQueryRepository.findById(id);
    user.setIsEmailVerified(isEmailVerified);
    return this.userRepository.update(user);
  }

  async uploadProfileImage(): Promise<any> {
    //
  }
}
