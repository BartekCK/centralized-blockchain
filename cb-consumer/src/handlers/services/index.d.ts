import { Success } from '../../common/interfaces/success';
import { Block } from '../../domain/entities/block.entity';
import { Failure } from '../../common/interfaces/failure';

export type CreateBlockResult = Success<Block> | Failure;
export type ValidateBlockResult = Success<boolean> | Failure;
