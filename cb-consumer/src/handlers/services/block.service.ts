import { Block } from '../../domain/entities/block.entity';
import { ValueData } from '../../domain/value-objects/value-data';
import { CreateBlockResult, ValidateBlockResult } from './index';

export interface BlockServiceInterface {
  createBlock(valueData: ValueData): Promise<CreateBlockResult>;
  isBlockValid(block: Block): Promise<ValidateBlockResult>;
}
