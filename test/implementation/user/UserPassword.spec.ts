import { UserPassword } from '../../../src/user/domain/UserPassword';

test('should hash the plain password', async () => {
  // given
  const plainPassword = `'6U'y5v(>1',!`;
  // when
  const hashedPassword = await UserPassword.createPassword(plainPassword);
  // then
  expect(hashedPassword.toString()).not.toMatch(plainPassword);
});
