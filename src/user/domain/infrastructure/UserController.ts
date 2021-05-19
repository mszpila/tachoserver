import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { FindUserDto } from '../dto/FindUserDto';
import { GetUserDto } from '../dto/GetUserDto';
import { LoginDto } from '../dto/LoginDto';
import { UploadDocumentDto } from '../dto/UploadDocumentDto';
import { UserDto } from '../dto/UserDto';
import { UserUpdateDto } from '../dto/UserUpdateDto';
import { UserFacade } from '../UserFacade';

@Controller('users')
export class UserController {
  constructor(private userFacade: UserFacade) {}

  @Get()
  find(@Query() findUserDto: FindUserDto): Promise<GetUserDto[]> {
    return this.userFacade.find(findUserDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userFacade.getById(id);
  }

  @Post('register')
  register(@Body() userDto: UserDto): Promise<boolean> {
    return this.userFacade.register(userDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto): Promise<boolean> {
    return this.userFacade.login(loginDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() userUpdateDto: UserUpdateDto) {
    return this.userFacade.update(id, userUpdateDto);
  }

  @Put(':id')
  submitVerification(
    @Param('id') id: string,
    @Body() uploadDocumentDto: UploadDocumentDto,
  ) {
    return this.userFacade.submitVerification(id, uploadDocumentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userFacade.deleteById(id);
  }
}
