import { DatabaseConnector } from './infrastructure/config/database-connector';
import { EnvConfig } from './infrastructure/config/env-config';
import { LoggerService } from './common/services/logger.service';
import { BlockRepository } from './infrastructure/repositories/block.repository';
import { BlockService } from './infrastructure/services/block.service';

const main = async () => {
  const appLogger = new LoggerService();
  const dbLogger = new LoggerService('DATABASE');

  const connection = await DatabaseConnector.connect(
    EnvConfig.getDatabaseConfigParams(),
    dbLogger,
  );

  const blockRepository = new BlockRepository(connection);

  const blockService = new BlockService(blockRepository);

  appLogger.info('Application successfully started');
};

main();

//
// const chain = BlockService.create(1);
// chain.addBlock(new ValueData('Ala ma kota'));
// chain.addBlock(new ValueData('I Psa marka'));

// console.log(chain.isValid());
