import {
  Controller,
  Get,
  UseGuards,
  Req,
  NotFoundException,
  Post,
  Delete,
  Param,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DriveService } from './drive.service';
import { AppDataService } from './app-data.service';
import { SheetsService } from './sheets.service';

@Controller('drive')
export class DriveController {
  constructor(
    private appDataService: AppDataService,
    private driveService: DriveService,
    private sheetsService: SheetsService,
  ) {}

  @Get('appdata')
  @UseGuards(AuthGuard('jwt'))
  async getAppData(@Req() req) {
    try {
      const appData = await this.appDataService.getAppDataConfigFile(
        req.user.accessToken,
      );
      return appData;
    } catch (err) {
      throw new NotFoundException();
    }
  }

  @Post('appdata')
  @UseGuards(AuthGuard('jwt'))
  async createAppData(@Req() req) {
    const title = req.body.location.split('/').pop();
    const location = req.body.location.replace(title, '');
    const content = {
      pathOfDb: location,
      title,
      id: '',
    };
    const sheet = await this.sheetsService.createSheet(
      req.user.accessToken,
      title,
    );
    content.id = sheet.data.spreadsheetId;
    return this.appDataService.createAppDataConfigFile(
      req.user.accessToken,
      content,
    );
  }

  @Delete('appdata')
  @UseGuards(AuthGuard('jwt'))
  async deleteAppData(@Req() req) {
    return this.appDataService.deleteAppDataConfigFile(req.user.accessToken);
  }

  @Get('sheet/:id')
  @UseGuards(AuthGuard('jwt'))
  async getFile(@Req() req, @Param('id') id, @Query('range') range) {
    try {
      return await this.sheetsService.getSheet(req.user.accessToken, id, [
        range,
      ]);
    } catch (err) {
      throw new NotFoundException();
    }
  }
}
