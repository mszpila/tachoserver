import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UserFacade } from '../UserFacade';

@Controller('users')
export class UserController {
  constructor(private userFacade: UserFacade) {}

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   // return this.usersService.create(createUserDto);
  // }

  @Get()
  findAll(@Query() query) {
    // return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // return this.usersService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   // return this.usersService.update(+id, updateUserDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    // return this.usersService.remove(+id);
  }
}
