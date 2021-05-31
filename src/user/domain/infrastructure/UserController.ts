import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
  Res,
  UseGuards,
  Request,
  HttpStatus,
  HttpCode,
  Req,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthenticationService } from '../../../shared/authentication/AuthenticationService';
import { JwtAuthGuard } from '../../../shared/authentication/JwtAuthGuard';
import { FindUserDto } from '../dto/FindUserDto';
import { GetUserDto } from '../dto/GetUserDto';
import { LoginDto } from '../dto/LoginDto';
import { UploadDocumentDto } from '../dto/UploadDocumentDto';
import { CreateUserDto } from '../dto/UserDto';
import { UserUpdateDto } from '../dto/UserUpdateDto';
import { UserFacade } from '../UserFacade';

@Controller()
export class UserController {
  constructor(
    private userFacade: UserFacade,
    private authService: AuthenticationService,
  ) {}

  @Get('users')
  find(@Query() findUserDto: FindUserDto): Promise<GetUserDto[]> {
    return this.userFacade.find(findUserDto);
  }

  @Get('users/:id')
  findOne(@Param('id') id: string) {
    return this.userFacade.getById(id);
  }

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
  authTest(@Req() req: any) {
    return req.user;
  }
}
