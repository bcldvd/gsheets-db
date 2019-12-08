import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DriveService } from './drive.service';

@Controller('drive')
export class DriveController {

    constructor(
        private driveService: DriveService,
    ) {}

  @Get('appdata')
  @UseGuards(AuthGuard('jwt'))
  async listAppData(@Req() req) {
    return await this.driveService.listAppData(req.user.accessToken);
  }
}
