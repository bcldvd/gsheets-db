import { Controller, Get, UseGuards, Res, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '../config/config.service';

@Controller('auth')
export class AuthController {
  constructor(private config: ConfigService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {
    // initiates the Google OAuth2 login flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleLoginCallback(@Req() req, @Res() res) {
    // handles the Google OAuth2 callback
    const jwt: string = req.user.jwt;
    if (jwt) {
      res.redirect(
        `${this.config.get('URL_CALLBACK')}/login/success?jwt=` + jwt,
      );
    } else {
      res.redirect(`${this.config.get('URL_CALLBACK')}/login?failure=true`);
    }
  }

  @Get('protected')
  @UseGuards(AuthGuard('jwt'))
  protectedResource(@Req() req) {
    return 'JWT is working!';
  }
}
