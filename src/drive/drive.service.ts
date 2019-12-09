import { Injectable } from '@nestjs/common';
import {google} from 'googleapis';
import { ConfigService } from 'src/config/config.service';

@Injectable()
export class DriveService {

    constructor(
        private config: ConfigService,
    ) {}

    async listAppData(accessToken: string) {
        const  drive = google.drive({version: 'v3', auth: this.getConfigFromToken(accessToken)});
        const params = {
            spaces: 'appDataFolder',
            pageSize: 3,
        };
        const res = await drive.files.list(params);
        return res.data;
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
