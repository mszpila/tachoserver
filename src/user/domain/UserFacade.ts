import { BadRequestException, Injectable } from '@nestjs/common';
import { FindUserDto } from './dto/FindUserDto';
import { LoginDto } from './dto/LoginDto';
import { UserUpdateDto } from './dto/UserUpdateDto';
import { UserDto } from './dto/UserDto';
import { UserQueryRepository } from './IUserQueryRepository';
import { UserRepository } from './IUserRepository';
import { UserPassword } from './UserPassword';
import { UploadDocumentDto } from './dto/UploadDocumentDto';
import { UserUpdater } from './UserUpdater';
import { UserCreator } from './UserCreator';
import { GetUserDto } from './dto/GetUserDto';
import { DomainEventPublisher } from '../../shared/infrastructure/events/IDomainEventPublisher';
import { VERIFICATION_REQUESTED } from '../../shared/infrastructure/events/user/EventTopic';
import {
  UserVerificationRequest,
  UserVerified,
} from '../../shared/infrastructure/events/user/UserEvent';

@Injectable()
export class UserFacade {
  constructor(
    private userRepository: UserRepository,
    private userQueryRepository: UserQueryRepository,
    private domainEventPublisher: DomainEventPublisher,
    private updater: UserUpdater,
    private creator: UserCreator,
  ) {}

  async register(userDto: UserDto): Promise<boolean> {
    const user = await this.creator.from(userDto);
    return await this.userRepository.save(user);
  }

  async getById(id: string): Promise<GetUserDto> {
    const user = await this.userRepository.findById(id);
    const userDto = user.toDto();
    return new GetUserDto(
      userDto.id,
      userDto.firstName,
      userDto.lastName,
      userDto.email,
      userDto.isVerified,
    );
  }

  async find(query: FindUserDto): Promise<GetUserDto[]> {
    const users = await this.userQueryRepository.find(query);
    const usersArray: GetUserDto[] = [];
    for (const user of users) {
      usersArray.push(
        new GetUserDto(
          user.id,
          user.firstName,
          user.lastName,
          user.email,
          user.isVerified,
        ),
      );
    }
    return usersArray;
  }

  async login(login: LoginDto): Promise<boolean> {
    const foundUser = await this.userQueryRepository.findByEmailToComparePassowrd(
      login.email,
    );
    return await UserPassword.comparePassword(
      login.password,
      foundUser.password,
    );
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
    const isVerified = user.toDto().isVerified;
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
