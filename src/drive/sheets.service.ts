import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { ConfigService } from '../config/config.service';
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
    return await sheets.spreadsheets.get({
      spreadsheetId,
      includeGridData: true,
      ranges,
    });
  }

  private getSheetsAPI(accessToken: string) {
    return google.sheets({
      version: 'v4',
      auth: this.driveService.getConfigFromToken(accessToken),
    });
  }
}
