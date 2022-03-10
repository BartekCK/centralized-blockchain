import { IConfigParams } from './database-connector';
import * as path from 'path';

export class EnvConfig {
  private static injectEnv = async (): Promise<void> => {
    if (process.env.NODE_ENV === 'production') {
      return;
    }

    const { config } = await import('dotenv');

    switch (process.env.NODE_ENV) {
      case 'test':
        config({ path: path.join(__dirname, '../../../.env.test') });
        break;

      default:
        config({ path: path.join(__dirname, '../../../.env.dev') });
    }
  };

  public static getDatabaseConfigParams = async (): Promise<IConfigParams> => {
    await EnvConfig.injectEnv();
    return {
      database: process.env.DATABASE_NAME || '',
      host: process.env.DATABASE_HOST || '',
      port: Number(process.env.DATABASE_PORT),
      user: process.env.DATABASE_USER || '',
      password: process.env.DATABASE_PASSWORD || '',
    };
  };
}
