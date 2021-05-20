import { GetUserDto } from '../../../dto/GetUserDto';
import { User } from '../../../User';
import { MongoDbUserSnapshot } from './MongoDbUserSnapshot';
import { from as stringIdToBinary } from 'uuid-mongodb';

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
  return new GetUserDto(
    stringIdToBinary(userBJSON._id).toString(),
    userBJSON.firstName,
    userBJSON.lastName,
    userBJSON.email,
    userBJSON.isVerified,
  );
};
