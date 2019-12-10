import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { ConfigService } from '../config/config.service';

@Injectable()
export class DriveService {
  configFile = 'config.json';

  constructor(private config: ConfigService) {}

  async listAppData(accessToken: string) {
    return await this.list(accessToken, 'appDataFolder');
  }

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

  async createAppDataConfigFile(accessToken: string, content: ConfigFile) {
    const options = {
      accessToken,
      fileName: this.configFile,
      parents: ['appDataFolder'],
      content,
    };
    return await this.createFile(options);
  }

  async getAppDataConfigFile(accessToken: string): Promise<ConfigFile> {
    const appDataFiles = await this.listAppData(accessToken);
    const configFileInfo = appDataFiles.files.find(
      file => file.name === this.configFile,
    );
    const fileId = configFileInfo.id; // TODO: handle not found
    return (await this.getFile(accessToken, fileId)) as Promise<ConfigFile>;
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

  async getFile(accessToken: string, fileId: string) {
    const drive = this.getDriveAPI(accessToken);
    const params = {
      fileId,
      alt: 'media',
    };
    const res = await drive.files.get(params);
    return res.data;
  }

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

  private getSheetsAPI(accessToken: string) {
    return google.sheets({
      version: 'v4',
      auth: this.getConfigFromToken(accessToken),
    });
  }

  private getDriveAPI(accessToken: string) {
    return google.drive({
      version: 'v3',
      auth: this.getConfigFromToken(accessToken),
    });
  }

  private getConfigFromToken(accessToken: string) {
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

export interface ConfigFile {
  pathOfDb: string;
}
