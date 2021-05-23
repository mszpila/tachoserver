export class FindUserDto {
  readonly name?: string;
  readonly isVerified?: boolean;
  readonly offset?: number;
  readonly limit?: number;
  readonly sort?: string;
}
