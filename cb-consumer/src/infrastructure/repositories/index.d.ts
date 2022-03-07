import { Failure } from '../../common/interfaces/failure';
import { Success } from '../../common/interfaces/success';
import { Block } from '../../domain/entities/block.entity';

interface DatabaseFailure extends Failure {
  errorCode: 'DATABASE_UNKNOWN_ERROR';
}

interface BlockNotFoundFailure extends Failure {
  errorCode: 'BLOCK_NOT_FOUND';
}

interface SaveBlockSuccess extends Success<Block> {}
interface GetLastBlockSuccess extends Success<Block | null> {}
interface GetBlockByHashSuccess extends Success<Block> {}
interface GetBlocksSuccess extends Success<Block[]> {}

export type SaveBlockResult = SaveBlockSuccess | DatabaseFailure;
export type GetLastBlockResult = GetLastBlockSuccess | DatabaseFailure;
export type GetBlockByHashResult =
  | GetBlockByHashSuccess
  | DatabaseFailure
  | BlockNotFoundFailure;
export type GetBlocksResult = GetBlocksSuccess | DatabaseFailure;
