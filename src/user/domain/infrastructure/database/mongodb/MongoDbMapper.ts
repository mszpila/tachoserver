import { GetUserDto } from '../../../dto/GetUserDto';
import { User } from '../../../User';
import { MongoDbUserSnapshot } from './MongoDbUserSnapshot';
import { from as stringIdToBinary } from 'uuid-mongodb';
import { userMapper } from '../../../../domain/service/Mapper';
import { mapFrom } from '@automapper/core';

userMapper.createMap(MongoDbUserSnapshot, GetUserDto).forMember(
  (destination) => destination.id,
  mapFrom((source) => stringIdToBinary(source._id).toString()),
);

export const fromEntityToBJSON = (userEntity: User): MongoDbUserSnapshot => {
  const userToSave = {
    ...userEntity.toSnapShot(),
    _id: stringIdToBinary(userEntity.toSnapShot().id),
  };
  delete userToSave.id;
  return userToSave;
};

export const fromBJSONToEntity = (userBJSON: MongoDbUserSnapshot): User => {
  const userEntityToRestore = {
    ...userBJSON,
    id: stringIdToBinary(userBJSON._id).toString(),
  };
  delete userEntityToRestore._id;
  return User.restore(userEntityToRestore);
};

export const fromBJSONToGetUserDto = (
  userBJSON: MongoDbUserSnapshot,
): GetUserDto => {
  return userMapper.map(userBJSON, GetUserDto, MongoDbUserSnapshot);
};
