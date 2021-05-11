import { BadRequestException, Injectable } from '@nestjs/common';
import { FindDto } from './dto/FindDto';
import { LoginDto } from './dto/LoginDto';
import { UserUpdateDto } from './dto/UpdateDto';
import { UserDto } from './dto/UserDto';
import { UserQueryRepository } from './IUserQueryRepository';
import { UserRepository } from './IUserRepository';
import { UserPassword } from './UserPassword';
// import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { UploadDocumentDto } from './dto/UploadDocumentDto';
import { UserUpdater } from './UserUpdater';
import { UserCreator } from './UserCreator';
import { GetUserDto } from './dto/GetUserDto';
import { DomainEventPublisher } from '../../shared/infrastructure/events/IDomainEventPublisher';
import { DomainEvent } from '../../shared/infrastructure/events/DomainEvent';
import { VERIFICATION_REQUESTED } from '../../shared/infrastructure/events/EventTopic';

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

  async getById(id: string): Promise<UserDto> {
    const user = await this.userRepository.findById(id);
    const userDto = user.toDto();
    return UserDto.builder()
      .withId(userDto.id)
      .withFirstName(userDto.firstName)
      .withLastName(userDto.lastName)
      .withEmail(userDto.email)
      .withIsVerified(userDto.isVerified)
      .build();
  }

  async find(query: FindDto): Promise<GetUserDto[]> {
    query.name = query.name ? query.name.toLowerCase() : '';
    query.offset = query.offset || 0;
    query.limit = query.limit || 20;
    const users = await this.userQueryRepository.find(query);
    const usersArray: UserDto[] = [];
    for (const user of users) {
      usersArray.push(
        UserDto.builder()
          .withId(user.id)
          .withFirstName(user.firstName)
          .withLastName(user.lastName)
          .withEmail(user.email)
          .withIsVerified(user.isVerified)
          .build(),
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

  async update(id: string, userUpdateDto: UserUpdateDto): Promise<void> {
    await this.updater.execute(id, userUpdateDto);
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
      new DomainEvent(VERIFICATION_REQUESTED, {
        userId: id,
        frontUrl: upload.frontUrl,
        backUrl: upload.backUrl,
        selfieUrl: upload.selfieUrl,
      }),
    );
  }

  async verify(payload: any): Promise<void> {
    const user = await this.userRepository.findById(payload.id);
    user.setIsVerified(payload.isVerified);
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
