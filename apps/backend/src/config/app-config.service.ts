import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { StringValue } from 'ms';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  get accessTokenSecret(): StringValue {
    return this.configService.getOrThrow('ACCESS_TOKEN_SECRET');
  }

  get refreshTokenSecret(): StringValue {
    return this.configService.getOrThrow('REFRESH_TOKEN_SECRET');
  }

  get accessTokenExpiration(): StringValue {
    return this.configService.getOrThrow('ACCESS_TOKEN_EXPIRATION');
  }

  get refreshTokenExpiration(): StringValue {
    return this.configService.getOrThrow('REFRESH_TOKEN_EXPIRATION');
  }
}