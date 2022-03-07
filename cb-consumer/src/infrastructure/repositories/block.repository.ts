import { Block } from '../../domain/entities/block.entity';
import {
  DatabaseFailure,
  GetBlockByHashSuccess,
  GetBlocksSuccess,
  GetLastBlockSuccess,
  SaveBlockSuccess,
} from './index';
import { BlockRepositoryInterface } from './block.repository.interface';

export class BlockRepository implements BlockRepositoryInterface {
  saveBlock(block: Block): Promise<SaveBlockSuccess | DatabaseFailure> {
    throw new Error('Method not implemented.');
  }
  getLastBlock(): Promise<DatabaseFailure | GetLastBlockSuccess> {
    throw new Error('Method not implemented.');
  }
  getBlockByHash(
    hash: string,
  ): Promise<DatabaseFailure | GetBlockByHashSuccess> {
    throw new Error('Method not implemented.');
  }
  getBlocksBefore(
    timestamp: number,
  ): Promise<DatabaseFailure | GetBlocksSuccess> {
    throw new Error('Method not implemented.');
  }
}
