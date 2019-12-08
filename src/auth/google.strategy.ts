import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';

import { AuthService, Provider } from './auth.service';
import { ConfigService } from 'src/config/config.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly authService: AuthService,
    private config: ConfigService,
    ) {
    super({
      clientID: config.get('CLIENT_ID'),
      clientSecret: config.get('CLIENT_SECRET'),
      callbackURL: `${config.get('URL_SELF')}/auth/google/callback`,
      passReqToCallback: true,
      scope: [
          'profile',
        'https://www.googleapis.com/auth/drive.appdata',
        ],
    });
  }

  async validate(
    request: any,
    accessToken: string,
    refreshToken: string,
    profile: GoogleProfile,
    done: Function,
  ) {
    try {
      const jwt: string = await this.authService.validateOAuthLogin(
        profile.id,
        Provider.GOOGLE,
        accessToken
      );

      const user = {
        jwt,
      };

      done(null, user);
    } catch (err) {
      done(err, false);
    }
  }
}

export interface GoogleProfile {
    id: string;
    displayName: string;
    name: { familyName: string, givenName: string };
    photos: {value: string}[];
    provider: Provider;
    _json: {
        sub: string;
        name: string;
        given_name: string;
        family_name: string;
        picture: string;
        locale: string;
    };
}