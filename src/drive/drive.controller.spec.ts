import { Test, TestingModule } from '@nestjs/testing';
import { DriveController } from './drive.controller';
import { ConfigModule } from '../config/config.module';
import { DriveService } from './drive.service';
import { AppDataService } from './app-data.service';
import { SheetsService } from './sheets.service';

describe('Drive Controller', () => {
  let controller: DriveController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DriveController],
      providers: [DriveService, AppDataService, SheetsService],
      imports: [ConfigModule],
    }).compile();

    controller = module.get<DriveController>(DriveController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
