import { Test, TestingModule } from '@nestjs/testing';
import { DriveService } from './drive.service';
import { ConfigModule } from '../config/config.module';

describe('DriveService', () => {
  let service: DriveService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DriveService],
      imports: [ConfigModule],
    }).compile();

    service = module.get<DriveService>(DriveService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
