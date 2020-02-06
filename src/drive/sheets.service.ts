import { Injectable } from '@nestjs/common';
import { google, sheets_v4 } from 'googleapis';
import { DriveService } from './drive.service';

const DEFAULT_RANGE_ALL = 'A1:Z1000';

@Injectable()
export class SheetsService {
  constructor(private driveService: DriveService) {}

  async createSheet(accessToken: string, title: string) {
    const sheets = this.getSheetsAPI(accessToken);
    const requestBody = {
      properties: {
        title,
      },
    };
    return await sheets.spreadsheets.create({
      requestBody,
    });
  }

  async getSheet(accessToken: string, spreadsheetId: string, ranges: string[]) {
    const sheets = this.getSheetsAPI(accessToken);
    const rawSheet = await sheets.spreadsheets.get({
      spreadsheetId,
      includeGridData: true,
      ranges,
    });

    return rawSheet;
  }

  async getData(
    accessToken: string,
    spreadsheetId: string,
    range = DEFAULT_RANGE_ALL,
  ) {
    const ranges = [range];
    const sheets = this.getSheetsAPI(accessToken);
    const rawSheet = await sheets.spreadsheets.get({
      spreadsheetId,
      includeGridData: false,
      ranges,
    });
    const sheetValues = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const merges = this.formatMerges(rawSheet.data.sheets[0].merges);
    const { titles, data } = this.splitValuesAndTitles(sheetValues.data.values);
    return this.toRowData(data, merges, titles);
  }

  private splitValuesAndTitles(sheetValues: string[][]) {
    const titles = sheetValues[0];
    const data = sheetValues.slice(1, sheetValues.length);
    return { titles, data };
  }

  private formatMerges(rawMerges: sheets_v4.Schema$GridRange[]) {
    const mergesArray = [];
    const merges = {};
    rawMerges.forEach(merge => {
      if (!merges.hasOwnProperty(merge.startRowIndex)) {
        merges[merge.startRowIndex] = [];
      }
      merges[merge.startRowIndex].push(merge);
    });
    delete merges[0];

    Object.keys(merges).forEach((key, index, array) => {
      const subGroups = [
        ...merges[key]
          .map(({ startColumnIndex, endColumnIndex }) => ({
            startColumnIndex,
            endColumnIndex,
          }))
          .slice(1, merges[key].length),
      ];
      const merge = {
        startRowIndex: merges[key][0].startRowIndex,
        subGroups,
      };
      if (index > 0 && index < array.length) {
        mergesArray[index - 1].endRowIndex = merges[key][0].startRowIndex;
      }
      mergesArray.push(merge);
    });

    return mergesArray;
  }

  private toRowData(sheetsData: string[][], merges, titles: string[]) {
    const rowData = [];
    merges.forEach(merge => {
      for (let i = merge.startRowIndex; i < merge.endRowIndex; i++) {
        const groupRowIndex = merge.startRowIndex - 1;
        const row = {
          groupTitle: sheetsData[groupRowIndex][0],
          subGroups: [],
        };

        sheetsData[i].forEach((value, index) => {
          if (!this.isInSubGroup(merge.subGroups, index)) {
            row[titles[index]] = value;
          }
        });

        merge.subGroups.forEach(subGroupDelimiter => {
          const subGroup = {
            title:
              sheetsData[groupRowIndex][subGroupDelimiter.startColumnIndex],
            headerTitle: titles[subGroupDelimiter.startColumnIndex],
            values: sheetsData[i].slice(
              subGroupDelimiter.startColumnIndex,
              subGroupDelimiter.endColumnIndex,
            ),
          };
          row.subGroups.push(subGroup);
        });

        rowData.push(row);
      }
    });
    return rowData;
  }

  async insertRow(accessToken: string, spreadsheetId: string, row: any) {
    const sheets = this.getSheetsAPI(accessToken);
    /* const appendOptions = {
      range: 'A15:A16',
      spreadsheetId,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        majorDimension: 'ROWS',
        values: [['06/01/2016', '😅', '', 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6]],
      },
    };
    return await sheets.spreadsheets.values.append(appendOptions); */

    const range = 'A1:Z1000';
    const test = await this.getData(accessToken, spreadsheetId);
    return test;
    /* return await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    }); */
  }

  /* async formatRow(accessToken: string, spreadsheetId: string, row: any) {
    const sheets = this.getSheetsAPI(accessToken);
    const appendOptions = {
      range: 'A15:A16',
      spreadsheetId,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        majorDimension: 'ROWS',
        values: [['06/01/2016', '😅', '', 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6]],
      },
    };
    return await sheets.spreadsheets.batchUpdate(appendOptions);
  }

  {
    "requests": [
      {
        "mergeCells": {
          "range": {
            "sheetId": sheetId,
            "startRowIndex": 0,
            "endRowIndex": 2,
            "startColumnIndex": 0,
            "endColumnIndex": 2
          },
          "mergeType": "MERGE_ALL"
        }
      },
      {
        "mergeCells": {
          "range": {
            "sheetId": sheetId,
            "startRowIndex": 2,
            "endRowIndex": 6,
            "startColumnIndex": 0,
            "endColumnIndex": 2
          },
          "mergeType": "MERGE_COLUMNS"
        }
      },
    ]
  } 
  
  {
  "requests": [
    {
      "updateBorders": {
        "range": {
          "sheetId": sheetId,
          "startRowIndex": 0,
          "endRowIndex": 10,
          "startColumnIndex": 0,
          "endColumnIndex": 6
        },
        "top": {
          "style": "DASHED",
          "width": 1,
          "color": {
            "blue": 1.0
          },
        },
        "bottom": {
          "style": "DASHED",
          "width": 1,
          "color": {
            "blue": 1.0
          },
        },
        "innerHorizontal": {
          "style": "DASHED",
          "width": 1,
          "color": {
            "blue": 1.0
          },
        },
      }
    }
  ]
}*/

  private isInSubGroup(
    subGroupsDelimiters: sheets_v4.Schema$GridRange[],
    index: number,
  ) {
    let isPresent = false;
    subGroupsDelimiters.forEach(subGroup => {
      if (
        subGroup.startColumnIndex <= index &&
        subGroup.endColumnIndex > index
      ) {
        isPresent = true;
      }
    });
    return isPresent;
  }

  private getSheetsAPI(accessToken: string) {
    return google.sheets({
      version: 'v4',
      auth: this.driveService.getConfigFromToken(accessToken),
    });
  }
}
