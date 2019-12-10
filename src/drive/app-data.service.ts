import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { DriveService } from './drive.service';
import { drive_v3 } from 'googleapis';

@Injectable()
export class AppDataService {
  configFile = 'config.json';

  constructor(private driveService: DriveService) {}

  async listAppData(accessToken: string) {
    return await this.driveService.list(accessToken, 'appDataFolder');
  }

  async createAppDataConfigFile(accessToken: string, content: ConfigFile) {
    const options = {
      accessToken,
      fileName: this.configFile,
      parents: ['appDataFolder'],
      content,
    };
    return await this.driveService.createFile(options);
  }

  async getAppDataConfigFile(accessToken: string): Promise<ConfigFile> {
    const fileId = await this.getAppDataConfigFileId(accessToken);
    return (await this.driveService.getFile(accessToken, fileId)) as Promise<
      ConfigFile
    >;
  }

  async deleteAppDataConfigFile(accessToken: string) {
    const fileId = await this.getAppDataConfigFileId(accessToken);
    return await this.driveService.deleteFile(accessToken, fileId);
  }

  async getAppDataConfigFileId(accessToken: string): Promise<string> {
    const appDataFiles = await this.listAppData(accessToken);
    const configFileInfo = appDataFiles.files.find(
      file => file.name === this.configFile,
    );

    if (!configFileInfo) {
      throw new Error('file not found');
    }

    return configFileInfo.id;
  }

  isAppDataFound(foundFiles: drive_v3.Schema$FileList): boolean {
    return (
      foundFiles.files &&
      foundFiles.files.length > 0 &&
      foundFiles.files[0].name === this.configFile
    );
  }
}

export interface ConfigFile {
  pathOfDb: string;
  title: string;
  id: string;
}
