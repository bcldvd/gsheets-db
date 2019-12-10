import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { ConfigService } from '../config/config.service';

@Injectable()
export class DriveService {
  constructor(private config: ConfigService) {}

  async list(
    accessToken: string,
    spaces: string = 'drive',
    pageSize: number = 3,
  ) {
    const drive = this.getDriveAPI(accessToken);
    const params = {
      spaces,
      pageSize,
    };
    const res = await drive.files.list(params);
    return res.data;
  }

  async createFile(options: CreateFileOpts) {
    const drive = this.getDriveAPI(options.accessToken);
    const fileMetadata = {
      name: options.fileName,
      parents: options.parents,
    };
    const media = {
      mimeType: 'application/json',
      body: JSON.stringify(options.content),
    };
    const res = await drive.files.create({
      requestBody: fileMetadata,
      media,
    });
    return res.data;
  }

  async deleteFile(accessToken: string, fileId: string) {
    const drive = this.getDriveAPI(accessToken);
    const res = await drive.files.delete({
      fileId,
    });
    return res.data;
  }

  async getFile(accessToken: string, fileId: string) {
    const drive = this.getDriveAPI(accessToken);
    const params = {
      fileId,
      alt: 'media',
    };
    const res = await drive.files.get(params);
    return res.data;
  }

  private getDriveAPI(accessToken: string) {
    return google.drive({
      version: 'v3',
      auth: this.getConfigFromToken(accessToken),
    });
  }

  getConfigFromToken(accessToken: string) {
    const oauth2Client = new google.auth.OAuth2(
      this.config.get('CLIENT_ID'),
      this.config.get('CLIENT_SECRET'),
    );

    oauth2Client.credentials = {
      access_token: accessToken,
    };

    return oauth2Client;
  }
}

export interface CreateFileOpts {
  accessToken: string;
  fileName: string;
  parents: string[];
  content: string | any;
}
