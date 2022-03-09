import { Block } from '../../domain/entities/block.entity';

import {
  BlockRepositoryInterface,
  GetBlockByHashResult,
  GetBlocksResult,
  GetLastBlockResult,
  SaveBlockResult,
} from './block.repository.interface';
import { Knex } from 'knex';

export class BlockRepository implements BlockRepositoryInterface {
  constructor(private readonly db: Knex) {}

  saveBlock(block: Block): Promise<SaveBlockResult> {
    throw new Error('Method not implemented.');
  }

  getLastBlock(): Promise<GetLastBlockResult> {
    throw new Error('Method not implemented.');
  }

  getBlockByHash(hash: string): Promise<GetBlockByHashResult> {
    throw new Error('Method not implemented.');
  }

  getBlocksBefore(timestamp: number): Promise<GetBlocksResult> {
    throw new Error('Method not implemented.');
  }
}
