import { IConfigParams } from './database-connector';

export class EnvConfig {
  public static getDatabaseConfigParams = (): IConfigParams => {
    return {
      database: process.env.DATABASE_NAME || '',
      host: process.env.DATABASE_HOST || '',
      port: Number(process.env.DATABASE_PORT),
      user: process.env.DATABASE_USER || '',
      password: process.env.DATABASE_PASSWORD || '',
    };
  };
}
