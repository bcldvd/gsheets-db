import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '../config/config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET_KEY'),
    });
  }

  async validate(payload, done: (err: any, payload: any) => void) {
    try {
      // You could add a function to the authService to verify the claims of the token:
      // i.e. does the user still have the roles that are claimed by the token
      // const validClaims = await this.authService.verifyTokenClaims(payload);

      // if (!validClaims)
      //    return done(new UnauthorizedException('invalid token claims'), false);

      done(null, payload);
    } catch (err) {
      throw new UnauthorizedException('unauthorized', err.message);
    }
  }
}
