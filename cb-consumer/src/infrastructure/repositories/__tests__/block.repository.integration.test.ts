import { DatabaseConnector } from '../../config/database-connector';
import { EnvConfig } from '../../config/env-config';
import { LoggerService } from '../../../common/services/logger.service';
import { Knex } from 'knex';
import { BlockRepositoryInterface } from '../block.repository.interface';
import { BlockRepository } from '../block.repository';
import { Block } from '../../../domain/entities/block.entity';
import { ValueData } from '../../../domain/value-objects/value-data';

describe('Block repository implementation integration test', () => {
  let db: Knex;

  let repository: BlockRepositoryInterface;

  beforeEach(async () => {
    const connectionLogger = new LoggerService('DATABASE_TEST');
    const repositoryLogger = new LoggerService('REPOSITORY_TEST');

    db = await DatabaseConnector.connect(
      await EnvConfig.getDatabaseConfigParams(),
      connectionLogger,
    );

    await db.raw(`TRUNCATE "block"`);

    repository = new BlockRepository(db, repositoryLogger);
  });

  afterEach(async () => {
    await DatabaseConnector.close();
  });

  it('should save new block into database', async () => {
    const firstBlock = Block.createBlock(
      new ValueData('Example message'),
      null,
    );
    firstBlock.mine(0);
    await repository.saveBlock(firstBlock);

    const secondBlock = Block.createBlock(
      new ValueData('Example message'),
      firstBlock.hash,
    );
    secondBlock.mine(0);
    await repository.saveBlock(secondBlock);

    const result = await db.select('*').from('block');

    expect(result).toHaveLength(2);

    [firstBlock, secondBlock].forEach((block, index) => {
      expect(result[index]).toStrictEqual({
        id: expect.any(String),
        timestamp: new Date(block.timestamp),
        hash: block.hash,
        pow: block.pow,
        data: block.data.message,
        previous_hash: block.previousHash,
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      });
    });
  });
});
