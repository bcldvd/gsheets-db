import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { sign } from 'jsonwebtoken';

import { ConfigService } from '../config/config.service';

export enum Provider {
  GOOGLE = 'google',
}

@Injectable()
export class AuthService {
  constructor(
    private config: ConfigService,
  ) {}

  async validateOAuthLogin(
    thirdPartyId: string,
    provider: Provider,
    accessToken: string,
  ): Promise<string> {
    try {
      const payload = {
        thirdPartyId,
        provider,
        accessToken,
      };

      const jwt: string = sign(payload, this.config.get('JWT_SECRET_KEY'), {
        expiresIn: 3600,
      });
      return jwt;
    } catch (err) {
      throw new InternalServerErrorException('validateOAuthLogin', err.message);
    }
  }
}
