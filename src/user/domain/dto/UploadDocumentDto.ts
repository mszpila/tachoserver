// export class UploadDocumentDto {
//   frontUrl: string;
//   backUrl: string;
//   selfieUrl: string;
// }

export class UploadDocumentDto {
  readonly frontUrl: string;
  readonly backUrl: string;
  readonly selfieUrl: string;

  constructor(frontUrl = '', backUrl = '', selfieUrl = '') {
    this.frontUrl = frontUrl;
    this.backUrl = backUrl;
    this.selfieUrl = selfieUrl;
  }
}
