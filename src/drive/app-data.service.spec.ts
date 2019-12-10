import { Test, TestingModule } from '@nestjs/testing';
import { DriveService } from './drive.service';
import { ConfigModule } from '../config/config.module';
import { AppDataService } from './app-data.service';

describe('AppDataService', () => {
  let service: AppDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppDataService, DriveService],
      imports: [ConfigModule],
    }).compile();

    service = module.get<AppDataService>(AppDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('isAppDataFound', () => {
    it('should return true if config is found in list', () => {
      const mockList = {
        files: [
          {
            kind: 'drive#file',
            id: '1cmj1kxdTR659kgGxAuQyDCOEyVS6eTgK6pz6DAmqI3RCbsFXpw',
            name: 'config.json',
            mimeType: 'application/json',
          },
        ],
      };
      expect(service.isAppDataFound(mockList)).toBe(true);
    });

    it('should return false if config is not found in list', () => {
      const mockList = { files: [] };
      expect(service.isAppDataFound(mockList)).toBe(false);
    });
  });
});
