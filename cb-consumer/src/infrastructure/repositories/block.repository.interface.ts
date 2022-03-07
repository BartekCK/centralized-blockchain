import { Block } from '../../domain/entities/block.entity';
import {
  GetBlockByHashResult,
  GetBlocksResult,
  GetLastBlockResult,
  SaveBlockResult,
} from './index';

export interface BlockRepositoryInterface {
  saveBlock(block: Block): Promise<SaveBlockResult>;
  getLastBlock(): Promise<GetLastBlockResult>;
  getBlockByHash(hash: string): Promise<GetBlockByHashResult>;
  getBlocksBefore(timestamp: number): Promise<GetBlocksResult>;
}
