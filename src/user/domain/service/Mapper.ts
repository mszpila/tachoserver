import { Mapper } from '@automapper/types';
import { classes } from '@automapper/classes';
import { createMapper } from '@automapper/core';
import { UserSnapshot } from '../UserSnapshot';
import { GetUserDto } from '../dto/GetUserDto';

const userMapper: Mapper = createMapper({
  name: 'user',
  pluginInitializer: classes,
});

userMapper.createMap(UserSnapshot, GetUserDto);

export { userMapper };
