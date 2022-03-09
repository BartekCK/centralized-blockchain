import { Block } from '../../domain/entities/block.entity';
import { ValueData } from '../../domain/value-objects/value-data';
import { Failure, Success } from '../../common/interfaces';

export type CreateBlockResult = Success<Block> | Failure;
export type ValidateBlockResult = Success<boolean> | Failure;

export interface BlockServiceInterface {
  createBlock(valueData: ValueData): Promise<CreateBlockResult>;
  isBlockValid(block: Block): Promise<ValidateBlockResult>;
}
