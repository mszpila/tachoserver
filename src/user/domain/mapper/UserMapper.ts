// import { UserDto } from '../dto/UserDtoOrigin';
// import { User } from '../User';
// import { UserName, UserNameTypes } from '../UserName';
// import { UserType } from '../UserType';

// export class UserMapper {
//   // after creating user or sth
//   public static convertToDTO(user: User): UserDto {
//     return {
//       username: user.username.value,
//       isEmailVerified: user.isEmailVerified,
//       isAdminUser: user.isAdminUser,
//       isDeleted: user.isDeleted,
//     };
//   }

//   public static convertToEntity(userDto: UserDto): User {
//     const userNameOrError = UserName.create(
//       userDto.firstName,
//       UserNameTypes.FIRST,
//     );
//     const userPasswordOrError = UserPassword.create({
//       value: raw.user_password,
//       hashed: true,
//     });
//     const userEmailOrError = UserEmail.create(raw.user_email);

//     const userOrError = User.create(
//       {
//         username: userNameOrError.getValue(),
//         isAdminUser: raw.is_admin_user,
//         isDeleted: raw.is_deleted,
//         isEmailVerified: raw.is_email_verified,
//         password: userPasswordOrError.getValue(),
//         email: userEmailOrError.getValue(),
//       },
//       new UniqueEntityID(raw.base_user_id),
//     );

//     userOrError.isFailure ? console.log(userOrError.error) : '';

//     return userOrError.isSuccess ? userOrError.getValue() : null;
//   }

//   public static async convertToPersistence(user: User): Promise<any> {
//     let password: string = null;
//     if (!!user.password === true) {
//       if (user.password.isAlreadyHashed()) {
//         password = user.password.value;
//       } else {
//         password = await user.password.getHashedValue();
//       }
//     }

//     return {
//       base_user_id: user.userId.id.toString(),
//       user_email: user.email.value,
//       is_email_verified: user.isEmailVerified,
//       username: user.username.value,
//       user_password: password,
//       is_admin_user: user.isAdminUser,
//       is_deleted: user.isDeleted,
//     };
//   }
// }
