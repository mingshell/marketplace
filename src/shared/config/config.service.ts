import * as fs from 'fs';
import { parse } from 'dotenv';
import { Configuration } from './config.keys';

export class ConfigService {
  private readonly envConfing: { [key: string]: string };
  static env: string = process.env.ENV;
  constructor() {
    if (ConfigService.env !== 'prod') {
      const envFilePath = __dirname + '/../../../.env';
      const existsPath = fs.existsSync(envFilePath);
      if (!existsPath) {
        console.log('.env file doesnt not exist.  ');
        process.exit(0);
      }
      this.envConfing = parse(fs.readFileSync(envFilePath));
    } else {
      this.envConfing = {
        PORT: process.env.PORT,
        ENV: process.env.ENV,
        CONNECT_DATABASE_DEV: process.env.CONNECT_DATABASE_DEV,
        CONNECT_DATABASE_TEST: process.env.CONNECT_DATABASE_TEST,
        CONNECT_DATABASE_PROD: process.env.CONNECT_DATABASE_PROD,
      };
    }
  }
  get(key: string): string {
    return this.envConfing[key];
  }

  getDatabaseConnection(env: string): string {
    switch (env) {
      case 'dev':
        return this.get(Configuration.CONNECT_DATABASE_DEV);
        break;
      case 'test':
        return this.get(Configuration.CONNECT_DATABASE_TEST);
        break;
      case 'prod':
        return this.get(Configuration.CONNECT_DATABASE_PROD);
        break;
      default:
        return this.get(Configuration.CONNECT_DATABASE_DEV);
    }
  }
}
