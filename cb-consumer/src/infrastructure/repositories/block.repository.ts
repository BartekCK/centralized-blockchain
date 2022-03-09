import { Block } from '../../domain/entities/block.entity';

import {
  BlockRepositoryInterface,
  GetBlockByHashResult,
  GetBlocksResult,
  GetLastBlockResult,
  SaveBlockResult,
} from './block.repository.interface';
import { Knex } from 'knex';
import { BlockDbDetails } from './block.details';
import { BlockMapper } from './block.mapper';
import { LoggerService } from '../../common/services/logger.service';

export class BlockRepository implements BlockRepositoryInterface {
  constructor(
    private readonly db: Knex,
    private readonly logger: LoggerService,
  ) {}

  async saveBlock(block: Block): Promise<SaveBlockResult> {
    try {
      await this.db
        .table<BlockDbDetails>('block')
        .insert(BlockMapper.mapBlockToBlockDbDetails(block));

      return { outcome: 'SUCCESS', data: block };
    } catch (error: any) {
      this.logger.error(`Saving new block error ${error.stack}`);
      return { outcome: 'FAILURE', errorCode: 'DATABASE_UNKNOWN_ERROR' };
    }
  }

  async getLastBlock(): Promise<GetLastBlockResult> {
    try {
      const blockDbRecord = await this.db
        .select('*')
        .from<BlockDbDetails>('block')
        .orderBy([{ column: 'timestamp', order: 'desc' }])
        .first();

      return {
        outcome: 'SUCCESS',
        data: blockDbRecord
          ? BlockMapper.mapBlockDbDetailsToBlock(blockDbRecord)
          : null,
      };
    } catch (error: any) {
      this.logger.error(`Get last block error ${error.stack}`);
      return { outcome: 'FAILURE', errorCode: 'DATABASE_UNKNOWN_ERROR' };
    }
  }

  async getBlockByHash(hash: string): Promise<GetBlockByHashResult> {
    try {
      const blockDbRecord = await this.db
        .select('*')
        .from<BlockDbDetails>('block')
        .where({ hash })
        .first();

      if (!blockDbRecord) {
        return { outcome: 'FAILURE', errorCode: 'BLOCK_NOT_FOUND' };
      }

      return {
        outcome: 'SUCCESS',
        data: BlockMapper.mapBlockDbDetailsToBlock(blockDbRecord),
      };
    } catch (error: any) {
      this.logger.error(`Get block by hash error ${error.stack}`);
      return { outcome: 'FAILURE', errorCode: 'DATABASE_UNKNOWN_ERROR' };
    }
  }

  async getBlocksBefore(timestamp: number): Promise<GetBlocksResult> {
    try {
      const blockDbRecord = await this.db
        .select('*')
        .from<BlockDbDetails>('block')
        .whereRaw(`block.timestamp < to_timestamp(${timestamp})`);

      return {
        outcome: 'SUCCESS',
        data: blockDbRecord.map(BlockMapper.mapBlockDbDetailsToBlock),
      };
    } catch (error: any) {
      this.logger.error(`Get block by hash error ${error.stack}`);
      return { outcome: 'FAILURE', errorCode: 'DATABASE_UNKNOWN_ERROR' };
    }
  }
}
