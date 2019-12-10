export class ConfigService {
  private readonly envConfig: { [key: string]: string };

  get(key: string): string {
    return process.env[key];
  }
}
