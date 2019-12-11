import { Test, TestingModule } from '@nestjs/testing';
import { DriveService } from './drive.service';
import { ConfigModule } from '../config/config.module';
import { SheetsService } from './sheets.service';

describe('SheetsService', () => {
  let service: SheetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SheetsService, DriveService],
      imports: [ConfigModule],
    }).compile();

    service = module.get<SheetsService>(SheetsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('matrixToRowData', () => {
    it('should be convert matrix to row data', () => {
      const mockData = [['day', 'workout', 'reps'], ['02/11/1991', 'C3', '12']];
      const expected = [
        {
          day: '02/11/1991',
          workout: 'C3',
          reps: '12',
        },
      ];
      expect(service['matrixToRowData'](mockData)).toStrictEqual(expected);
    });
  });
});
