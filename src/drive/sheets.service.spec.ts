import { Test, TestingModule } from '@nestjs/testing';
import { DriveService } from './drive.service';
import { ConfigModule } from '../config/config.module';
import { SheetsService } from './sheets.service';
import { MOCK_DATA } from './sheets.mock';

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

  describe('get data', () => {
    it('should use split titles and data', () => {
      const expectedTitles = [
        'Date',
        'Humeur',
        'BPM',
        'Répétitions',
        '',
        '',
        '',
        '',
        '',
        'Répétitions',
      ];

      const { titles, data } = service['splitValuesAndTitles'](
        MOCK_DATA.sheetValues,
      );

      expect(titles).toEqual(expectedTitles);
      expect(data[1][0]).toBe('06/01/2016');
    });

    it('should format merges accordingly', () => {
      const expectedMerges = [
        {
          startRowIndex: 1,
          endRowIndex: 10,
          subGroups: [
            {
              startColumnIndex: 3,
              endColumnIndex: 9,
            },
            {
              startColumnIndex: 9,
              endColumnIndex: 15,
            },
          ],
        },
      ];

      const formattedMerges = service['formatMerges'](MOCK_DATA.merges);

      expect(formattedMerges[0]).toStrictEqual(expectedMerges[0]);
      expect(formattedMerges[1]).not.toHaveProperty('endRowIndex');
      // Being the last merge, there's no end row
    });

    it('should format data accordingly', () => {
      const { titles, data } = service['splitValuesAndTitles'](
        MOCK_DATA.sheetValues,
      );
      const merges = service['formatMerges'](MOCK_DATA.merges);
      const expectedRows = [
        {
          Date: '06/01/2016',
          Humeur: '💪🏼',
          BPM: '',
          groupTitle: 'Niveau 2',
          subGroups: [
            {
              title: 'B1',
              headerTitle: 'Répétitions',
              values: ['6', '5', '4', '3', '2', '1'],
            },
            {
              title: 'A3',
              headerTitle: 'Répétitions',
              values: ['6', '5', '4', '3', '2', '1'],
            },
          ],
        },
      ];

      const rowData = service['toRowData'](data, merges, titles);

      expect(rowData[0]).toMatchObject(expectedRows[0]);
    });
  });
});
