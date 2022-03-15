import { DatabaseConnector } from '../../config/database-connector';
import { EnvConfig } from '../../config/env-config';
import { Knex } from 'knex';
import { BlockRepositoryInterface } from '../block.repository.interface';
import { BlockRepository } from '../block.repository';
import { Block } from '../../../domain/entities/block.entity';
import { ValueData } from '../../../domain/value-objects/value-data';
import { createBlocksSyncHappyPath } from './mocks/blocks.happy.path.mock';
import { isSuccessAssert } from '../../../common/__tests__/helpers/isSuccessAssert';
import { LoggerServiceMock } from '../../../common/services/mocks/logger.service.mock';

describe('Block repository implementation integration test', () => {
  let db: Knex;

  let repository: BlockRepositoryInterface;

  beforeEach(async () => {
    const logger = new LoggerServiceMock();

    db = await DatabaseConnector.connect(
      await EnvConfig.getDatabaseConfigParams(),
      logger,
    );

    await db.raw(`TRUNCATE "block"`);

    repository = new BlockRepository(db, logger);
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

  describe('should get', () => {
    let blocks: Block[];

    beforeEach(async () => {
      blocks = await createBlocksSyncHappyPath();

      await Promise.all(
        blocks.map((block) => {
          repository.saveBlock(block);
        }),
      );
    });

    it('only last block "getLastBlock"', async () => {
      const lastBlockResult = await repository.getLastBlock();

      isSuccessAssert(lastBlockResult);

      const { data: lastBlock } = lastBlockResult;

      expect(lastBlock!.hash).toEqual(blocks[blocks.length - 1].hash!);
    });

    it('block by hash', async () => {
      const block = blocks[0];
      const lastBlockResult = await repository.getBlockByHash(block.hash!);

      isSuccessAssert(lastBlockResult);

      const { data: resultBlock } = lastBlockResult;

      expect(resultBlock!.hash).toEqual(block.hash!);
    });

    it('all blocks before', async () => {
      const index = 4;
      const block = blocks[index];
      const getBlocksBeforeResult = await repository.getBlocksBefore(
        block.timestamp,
      );
      isSuccessAssert(getBlocksBeforeResult);

      const { data: blocksBefore } = getBlocksBeforeResult;

      expect(blocksBefore.length).toEqual(index);
      blocksBefore.reverse().map((el, innerIndex) => {
        expect(el.hash).toEqual(blocks[innerIndex].hash);
      });
    });
  });
});
