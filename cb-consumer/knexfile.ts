import * as path from 'path';

import { DatabaseConnector } from './src/infrastructure/config/database-connector';
import { EnvConfig } from './src/infrastructure/config/env-config';
import { Knex } from 'knex';

const fetchConfiguration = async (): Promise<Knex.Config> => {
  return DatabaseConnector.getConnectionData(
    await EnvConfig.getDatabaseConfigParams(),
    {
      migrations: {
        extension: 'ts',
        directory: path.join(__dirname, './.database/migrations'),
        tableName: 'knex_migrations',
      },
    },
  );
};

export default fetchConfiguration;
