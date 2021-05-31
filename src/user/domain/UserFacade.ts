import { BadRequestException, Injectable } from '@nestjs/common';
import { FindUserDto } from './dto/FindUserDto';
import { LoginDto } from './dto/LoginDto';
import { UserUpdateDto } from './dto/UserUpdateDto';
import { CreateUserDto } from './dto/UserDto';
import { UserQueryRepository } from './IUserQueryRepository';
import { UserRepository } from './IUserRepository';
import { UserPassword } from './UserPassword';
import { UploadDocumentDto } from './dto/UploadDocumentDto';
import { UserUpdater } from './UserUpdater';
import { UserCreator } from './UserCreator';
import { GetUserDto } from './dto/GetUserDto';
import { DomainEventPublisher } from '../../shared/infrastructure/events/IDomainEventPublisher';
import {
  USER_REGISTERED,
  VERIFICATION_REQUESTED,
} from '../../shared/infrastructure/events/user/EventTopic';
import {
  UserRegistered,
  UserVerificationRequest,
  UserVerified,
} from '../../shared/infrastructure/events/user/UserEvent';
import { userMapper } from './service/Mapper';
import { UserSnapshot } from './UserSnapshot';
import { UserEmail } from './UserEmail';
import { User } from './User';

@Injectable()
export class UserFacade {
  constructor(
    private userRepository: UserRepository,
    private userQueryRepository: UserQueryRepository,
    private domainEventPublisher: DomainEventPublisher,
    private updater: UserUpdater,
    private creator: UserCreator,
  ) {}

  async register(userDto: CreateUserDto): Promise<UserSnapshot> {
    const user = await this.creator.from(userDto);
    const savedUser = await this.userRepository.save(user);
    this.domainEventPublisher.publish(
      USER_REGISTERED,
      new UserRegistered({
        id: savedUser.id,
        email: savedUser.email,
        firstName: savedUser.firstName,
      }),
    );
    return savedUser;
  }

  async getById(id: string): Promise<GetUserDto> {
    const user = await this.userRepository.findById(id);
    return userMapper.map(user.toSnapShot(), GetUserDto, UserSnapshot);
  }

  async find(query: FindUserDto): Promise<GetUserDto[]> {
    return await this.userQueryRepository.find(query);
  }

  async login(login: LoginDto): Promise<UserSnapshot> {
    UserEmail.isValidEmail(login.email);
    const foundUser: UserSnapshot = await this.userRepository.findByEmail(
      login.email,
    );
    if (await UserPassword.comparePassword(login.password, foundUser.password))
      return foundUser;
  }

  async update(id: string, userUpdateDto: UserUpdateDto): Promise<boolean> {
    return await this.updater.execute(id, userUpdateDto);
  }

  async deleteById(id: string): Promise<boolean> {
    return await this.userRepository.delete(id);
  }

  async submitVerification(
    id: string,
    upload: UploadDocumentDto,
  ): Promise<void> {
    const user = await this.userRepository.findById(id);
    const isVerified = user.toSnapShot().isVerified;
    if (isVerified) {
      throw new BadRequestException('User already verified');
    }
    this.domainEventPublisher.publish(
      VERIFICATION_REQUESTED,
      new UserVerificationRequest({
        id,
        frontUrl: upload.frontUrl,
        backUrl: upload.backUrl,
        selfieUrl: upload.selfieUrl,
      }),
    );
  }

  async verify(payload: UserVerified): Promise<void> {
    const { id, isVerified } = payload.getData();
    const user = await this.userRepository.findById(id);
    user.setIsVerified(isVerified);
    await this.userRepository.update(user);
  }

  async confirmEmail(id: string, isEmailVerified: boolean): Promise<void> {
    const user = await this.userRepository.findById(id);
    user.setIsEmailVerified(isEmailVerified);
    await this.userRepository.update(user);
  }

  async uploadProfileImage(): Promise<any> {
    //
  }
}
