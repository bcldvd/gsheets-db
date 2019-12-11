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

    return this.matrixToRowData(this.rawSheetToMatrix(rawSheet.data));
  }

  private rawSheetToMatrix(rawSheet: sheets_v4.Schema$Spreadsheet) {
    const sheet = rawSheet.sheets[0].data[0].rowData;

    return sheet.map(row => {
      return row.values.map(cell => {
        return cell.formattedValue;
      });
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
