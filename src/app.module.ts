import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DriveService } from './drive/drive.service';
import { DriveController } from './drive/drive.controller';
import { ConfigService } from './config/config.service';
import { ConfigModule } from './config/config.module';
import { AppDataService } from './drive/app-data.service';
import { SheetsService } from './drive/sheets.service';

@Module({
  imports: [AuthModule, ConfigModule],
  controllers: [AppController, DriveController],
  providers: [
    AppService,
    DriveService,
    ConfigService,
    AppDataService,
    SheetsService,
  ],
})
export class AppModule {}
