// export class FindUserDto {
//   name = '';
//   isVerified = false;
//   offset = 0;
//   limit = 20;
//   sort = '';
// }

export class FindUserDto {
  readonly name: string;
  readonly isVerified: boolean;
  readonly offset: number;
  readonly limit: number;
  readonly sort: string;

  constructor(builder: FindDtoBuilder) {
    this.name = builder.getName();
    this.isVerified = builder.getVerified();
    this.offset = builder.getOffset();
    this.limit = builder.getLimit();
    this.sort = builder.getSort();
  }

  static builder(): FindDtoBuilder {
    return new FindDtoBuilder();
  }
}

class FindDtoBuilder {
  private name = '';
  private isVerified = false;
  private offset = 0;
  private limit = 20;
  private sort = '';

  getName(): string {
    return this.name;
  }

  getVerified(): boolean {
    return this.isVerified;
  }

  getOffset(): number {
    return this.offset;
  }

  getLimit(): number {
    return this.limit;
  }

  getSort(): string {
    return this.sort;
  }

  withName(name: string): FindDtoBuilder {
    this.name = name;
    return this;
  }

  withVerified(isVerified: boolean): FindDtoBuilder {
    this.isVerified = isVerified;
    return this;
  }

  withOffset(offset: number): FindDtoBuilder {
    this.offset = offset;
    return this;
  }

  withLimit(limit: number): FindDtoBuilder {
    this.limit = limit;
    return this;
  }

  withSort(sort: string): FindDtoBuilder {
    this.sort = sort;
    return this;
  }

  build(): FindUserDto {
    return new FindUserDto(this);
  }
}
