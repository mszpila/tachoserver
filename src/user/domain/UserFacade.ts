import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  FindUserDto,
  LoginDto,
  UserUpdateDto,
  CreateUserDto,
  UploadDocumentDto,
  GetUserDto,
} from './dto';
import { UserQueryRepository } from './IUserQueryRepository';
import { UserRepository } from './IUserRepository';
import { UserPassword } from './UserPassword';
import { UserUpdater } from './UserUpdater';
import { UserCreator } from './UserCreator';
import { UserSnapshot } from './UserSnapshot';
import { UserEmail } from './UserEmail';
import { User } from './User';
import { userMapper } from './service/Mapper';
import { OAuthUserDto } from '../../shared/authentication';
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
    if (await this.userRepository.findByEmail(userDto.email)) {
      throw new BadRequestException('Email already used');
    }
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

  async oauth(oauthDto: OAuthUserDto): Promise<UserSnapshot> {
    const foundUser = await this.userRepository.findByEmail(oauthDto.email);
    if (!foundUser) {
      const newUser = this.creator.fromOAuth(oauthDto);
      return await this.userRepository.save(newUser);
    }
    if (!foundUser.getOAuthId()) {
      throw new BadRequestException(
        'Email already associated with a custom account',
      );
    }
    if (foundUser.getOAuthId() !== oauthDto.id) {
      throw new BadRequestException('Wrong credentials');
    }
    return this.updater.fromOAuth(oauthDto, foundUser);
  }

  async getById(id: string): Promise<GetUserDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return userMapper.map(user.toSnapShot(), GetUserDto, UserSnapshot);
  }

  async find(query: FindUserDto): Promise<GetUserDto[]> {
    return await this.userQueryRepository.find(query);
  }

  async login(login: LoginDto): Promise<UserSnapshot> {
    UserEmail.isValidEmail(login.email);
    const foundUser: User = await this.userRepository.findByEmail(login.email);
    if (!foundUser) throw new BadRequestException('Wrong credentials');
    if (foundUser.getOAuthId())
      throw new BadRequestException('Email associated with Google account');
    if (
      await UserPassword.comparePassword(
        login.password,
        foundUser.getPassword(),
      )
    )
      return foundUser.toSnapShot();
    else throw new BadRequestException('Wrong credentials');
  }

  async update(id: string, userUpdateDto: UserUpdateDto): Promise<boolean> {
    return await this.updater.update(id, userUpdateDto);
  }

  async deleteById(id: string): Promise<boolean> {
    return await this.userRepository.delete(id);
  }

  async submitVerification(
    id: string,
    upload: UploadDocumentDto,
  ): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (user.getIsVerified()) {
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
    console.log(await this.userRepository.update(user));
  }

  async uploadProfileImage(): Promise<any> {
    //
  }
}
