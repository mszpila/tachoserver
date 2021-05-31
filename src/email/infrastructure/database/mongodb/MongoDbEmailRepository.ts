import * as mongo from 'mongodb';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectCollection } from 'nest-mongodb';
import { EmailRepository } from '../../../domain/IEmailRepository';
import { EmailVerificationDto } from 'src/email/dto/EmailVerificationDto';

@Injectable()
export class MongoDbEmailRepository implements EmailRepository {
  constructor(
    @InjectCollection('verification_tokens')
    private readonly repository: mongo.Collection,
  ) {
    this.initRepo();
  }

  private async initRepo(): Promise<void> {
    try {
      await this.repository.createIndexes([
        { key: { createdAt: 1 }, expireAfterSeconds: 86400 },
        { key: { token: 'hashed' } },
      ]);
    } catch (e) {
      console.log(e);
    }
  }

  async save(data: EmailVerificationDto): Promise<void> {
    await this.repository.insertOne({
      createdAt: new Date(),
      id: data.id,
      token: data.token,
    });
  }

  async findByToken(token: string): Promise<EmailVerificationDto> {
    const foundDocument = await this.repository.findOne({ token });
    if (!foundDocument) {
      throw new HttpException('Link has expired', HttpStatus.BAD_REQUEST);
    }
    return foundDocument;
  }
}
