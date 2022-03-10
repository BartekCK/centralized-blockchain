import knex, { Knex } from 'knex';
import { sleep } from '../../common/utils/sleep';
import { LoggerServiceInterface } from '../../common/services';

export interface IConfigParams {
  host: string;
  database: string;
  user: string;
  password: string;
  port: number;
}

export class DatabaseConnector {
  private static connector: DatabaseConnector;

  private constructor(private readonly _db: Knex) {}

  get db(): Knex {
    return this._db;
  }

  static getConnectionData(
    connection: IConfigParams,
    rest?: Partial<Knex.Config>,
  ): Knex.Config {
    return {
      client: 'postgresql',
      connection,
      pool: {
        min: 2,
        max: 10,
      },
      ...rest,
    };
  }

  static async connect(
    connection: IConfigParams,
    logger: LoggerServiceInterface,
  ): Promise<Knex> {
    if (!DatabaseConnector.connector) {
      const db = knex({
        client: 'postgresql',
        connection,
        pool: {
          min: 2,
          max: 10,
        },
      });
      DatabaseConnector.connector = new DatabaseConnector(db);
    }

    try {
      const result = await DatabaseConnector.checkConnection();

      logger.debug(result);
    } catch (error) {
      logger.fatal('PostgreSQL not connected');
    }

    return DatabaseConnector.connector.db;
  }

  private static checkConnection = async (): Promise<string> => {
    let count = 0;

    const checker = (): Promise<string> =>
      new Promise((resolve, reject) => {
        const db = DatabaseConnector.connector.db;

        db.raw('SELECT 1')
          .then(() => {
            resolve('PostgreSQL connected');
          })
          .catch(async (e) => {
            if (count < 5) {
              ++count;
              await sleep();
              resolve(checker());
              return;
            }

            reject(e);
          });
      });

    return checker();
  };
}
