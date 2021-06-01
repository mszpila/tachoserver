import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  AuthenticationService,
  AuthRequest,
  GoogleAuthGuard,
  JwtAuthGuard,
  JwtUserDto,
  OAuthUserDto,
} from '../../../shared/authentication';
import {
  CreateUserDto,
  FindUserDto,
  GetUserDto,
  LoginDto,
  UploadDocumentDto,
  UserUpdateDto,
} from '../dto';
import { UserFacade } from '../UserFacade';
import { UserSnapshot } from '../UserSnapshot';

@Controller()
export class UserController {
  constructor(
    private userFacade: UserFacade,
    private authService: AuthenticationService,
  ) {}

  @Post('auth/register')
  async register(@Body() userDto: CreateUserDto): Promise<any> {
    const user = await this.userFacade.register(userDto);
    return await this.authService.getAccessToken(user.id, user.userRoles);
  }

  @Post('auth/login')
  async login(@Body() loginDto: LoginDto): Promise<any> {
    const user = await this.userFacade.login(loginDto);
    return await this.authService.getAccessToken(user.id, user.userRoles);
  }

  @Get('auth/google')
  @UseGuards(GoogleAuthGuard)
  authenticateWithGoogleOAuth() {}

  @Get('auth/google/redirect')
  @UseGuards(GoogleAuthGuard)
  async processGoogleOAuth(@Req() req: AuthRequest<OAuthUserDto>) {
    const user: UserSnapshot = await this.userFacade.oauth(req.user);
    return await this.authService.getAccessToken(user.id, user.userRoles);
  }

  @Get('users')
  find(@Query() findUserDto: FindUserDto): Promise<GetUserDto[]> {
    return this.userFacade.find(findUserDto);
  }

  @Get('users/:id')
  findOne(@Param('id') id: string) {
    return this.userFacade.getById(id);
  }

  @Put('users/:id')
  update(@Param('id') id: string, @Body() userUpdateDto: UserUpdateDto) {
    return this.userFacade.update(id, userUpdateDto);
  }

  @Put('users/:id')
  submitVerification(
    @Param('id') id: string,
    @Body() uploadDocumentDto: UploadDocumentDto,
  ) {
    return this.userFacade.submitVerification(id, uploadDocumentDto);
  }

  @Delete('users/:id')
  remove(@Param('id') id: string) {
    return this.userFacade.deleteById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('auth/test')
  authTest(@Req() req: AuthRequest<JwtUserDto>) {
    const { id, roles }: JwtUserDto = req.user;
    return req.user;
  }
}
