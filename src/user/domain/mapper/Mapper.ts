import { createMapper, mapFrom } from '@automapper/core';
import { classes } from '@automapper/classes';
import { User } from '../User';
import { UserDto } from '../dto/UserDto';

export const mapper = createMapper({
  name: 'userMApper',
  pluginInitializer: classes,
});

mapper.createMap(User, UserDto);
