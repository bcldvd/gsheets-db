import { Injectable } from '@nestjs/common';
import { google, sheets_v4 } from 'googleapis';
import { DriveService } from './drive.service';

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

    return this.rawSheetToMatrix(rawSheet.data);
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
    return await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    // ->
    /* {
      "range": "Sheet1!A1:W1000",
      "majorDimension": "ROWS",
      "values": [
        [
          "Date",
          "Humeur",
          "BPM",
          "Répétitions",
          "",
          "",
          "",
          "",
          "",
          "Repetitions"
        ],
        [
          "Niveau 2",
          "",
          "",
          "B1",
          "",
          "",
          "",
          "",
          "",
          "A3"
        ],
        [
          "06/01/2016",
          "💪🏼",
          "",
          "5",
          "5",
          "5",
          "5",
          "5",
          "5",
          "5",
          "5",
          "5",
          "5",
          "5",
          "5"
        ],
        [
          "08/01/2016",
          "💪🏼",
          "",
          "6",
          "6",
          "6",
          "6",
          "6",
          "6",
          "6",
          "6",
          "6",
          "6",
          "6",
          "6"
        ],
        [
          "18/01/2016",
          "💪🏼",
          "",
          "5",
          "5",
          "5",
          "5",
          "5",
          "5",
          "5",
          "5",
          "5",
          "5",
          "5",
          "5"
        ],
        [
          "20/01/2016",
          "💪🏼",
          "",
          "6",
          "6",
          "6",
          "6",
          "6",
          "6",
          "6",
          "6",
          "6",
          "6",
          "6",
          "6"
        ],
        [
          "30/12/2019",
          "💪🏼",
          "",
          "7",
          "7",
          "7",
          "7",
          "7",
          "7",
          "7",
          "7",
          "7",
          "7",
          "7",
          "7"
        ],
        [
          "31/12/2019",
          "💪🏼",
          "",
          "8",
          "8",
          "8",
          "8",
          "8",
          "8",
          "8",
          "8",
          "8",
          "8",
          "8",
          "8"
        ],
        [
          "10/01/2020",
          "😅",
          "",
          "9",
          "9",
          "9",
          "9",
          "9",
          "9",
          "9",
          "9",
          "9",
          "9",
          "9",
          "9"
        ],
        [
          "22/01/2020",
          "🥵",
          "",
          "10",
          "10",
          "10",
          "10",
          "10",
          "10",
          "10",
          "10",
          "10",
          "10",
          "10",
          "10"
        ],
        [
          "Niveau 3",
          "",
          "",
          "B2",
          "",
          "",
          "",
          "",
          "",
          "A3"
        ],
        [
          "23/01/2020",
          "💪🏼",
          "",
          "5",
          "5",
          "5",
          "5",
          "5",
          "5",
          "5",
          "5",
          "5",
          "5",
          "5",
          "5"
        ],
        [],
        [],
        [
          "06/01/2016",
          "😅",
          "",
          "5",
          "5",
          "5",
          "5",
          "5",
          "5",
          "6",
          "6",
          "6",
          "6",
          "6",
          "6"
        ]
      ]
    } */
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

  private rawSheetToMatrix(rawSheet: sheets_v4.Schema$Spreadsheet) {
    if (!rawSheet.sheets[0].hasOwnProperty('data')) {
      return [[]];
    }

    const sheet = rawSheet.sheets[0];
    const rowData = sheet.data[0].rowData;

    const headers = this.getFormattedValuesFromRow(rowData[0]);

    const merges = {};
    sheet.merges.forEach(merge => {
      if (!merges.hasOwnProperty(merge.startRowIndex)) {
        merges[merge.startRowIndex] = [];
      }
      merges[merge.startRowIndex].push(merge);
    });

    const groupsDelimiters = this.getGroupsDelimiters(merges, rowData.length);
    return this.getGroups(groupsDelimiters, rowData, headers);
  }

  private getGroups(
    groupsDelimiters: GroupDelimiter[],
    rowData: sheets_v4.Schema$RowData[],
    headers: string[],
  ) {
    return groupsDelimiters.map(groupDelimiter => {
      return {
        title: rowData[groupDelimiter.startRowIndex].values[0].formattedValue,
        rowsData: rowData
          .slice(groupDelimiter.startRowIndex + 1, groupDelimiter.endRowIndex)
          .map(this.getFormattedValuesFromRow)
          .map(row =>
            this.setSubGroups(
              row,
              groupDelimiter.subGroups.map(subGroupDelimiter =>
                this.getSubGroupsTitles(rowData, subGroupDelimiter),
              ),
              headers,
            ),
          ),
      };
    });
  }

  private getSubGroupsTitles(
    rowData: sheets_v4.Schema$RowData[],
    subGroupDelimiter: sheets_v4.Schema$GridRange,
  ): GridRangeWithTitle {
    return {
      ...subGroupDelimiter,
      title:
        rowData[subGroupDelimiter.startRowIndex].values[
          subGroupDelimiter.startColumnIndex
        ].formattedValue,
    };
  }

  private setSubGroups(
    rowValues: string[],
    subGroupsDelimiters: GridRangeWithTitle[],
    headers: string[],
  ) {
    const subGroups = subGroupsDelimiters.map(subGroupDelimiter => {
      return {
        data: rowValues.slice(
          subGroupDelimiter.startColumnIndex,
          subGroupDelimiter.endColumnIndex,
        ),
        title: subGroupDelimiter.title,
      };
    });

    const row = {
      subGroups,
    };

    rowValues.forEach((value, index) => {
      if (!this.isInSubGroup(subGroupsDelimiters, index)) {
        row[headers[index]] = value;
      }
    });

    return row;
  }

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

  private getGroupsDelimiters(
    merges: { [key: string]: sheets_v4.Schema$GridRange[] },
    rowsLength: number,
  ): GroupDelimiter[] {
    const headerMerges = merges[0];
    delete merges[0];

    const mergesArray = Object.keys(merges).map(mergeKey => {
      return merges[mergeKey];
    }); // TODO: necessary ?

    const groups = [];
    mergesArray.forEach((merge, index) => {
      const group = {
        startRowIndex: merge[0].startRowIndex,
        endRowIndex: rowsLength,
        startColumnIndex: merge[0].startColumnIndex,
        subGroups: merge.filter(item => item.startColumnIndex !== 0),
      };

      if (index + 1 < mergesArray.length) {
        group.endRowIndex = mergesArray[index + 1][0].startRowIndex;
      }
      groups.push(group);
    });
    return groups;
  }

  private getFormattedValuesFromRow(row: sheets_v4.Schema$RowData) {
    return row.values.map((cell, cellIndex) => {
      /* if (this.isCellInMerge(merges, rowIndex, cellIndex)) {
        const nb = cellIndex - merges[rowIndex].startColumnIndex + 1;
        return `${
          row.values[merges[rowIndex].startColumnIndex].formattedValue
        } ${nb}`;
      } */
      return cell.formattedValue;
    });
  }

  private matrixToRowData(matrix: string[][]): RowData[] {
    const header = matrix.shift();
    return matrix.map(row => {
      const newRow = {};
      header.forEach((cell, index) => {
        newRow[cell] = row[index];
      });
      return newRow;
    });
  }

  private getSheetsAPI(accessToken: string) {
    return google.sheets({
      version: 'v4',
      auth: this.driveService.getConfigFromToken(accessToken),
    });
  }
}

export interface RowData {
  [key: string]: string;
}

export interface GroupDelimiter {
  startRowIndex: number;
  endRowIndex: number;
  startColumnIndex: number;
  subGroups: sheets_v4.Schema$GridRange[];
}

export interface GridRangeWithTitle extends sheets_v4.Schema$GridRange {
  title: string;
}
