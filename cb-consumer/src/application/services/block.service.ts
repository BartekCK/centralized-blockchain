import { Block } from '../../domain/entities/block.entity';
import { ValueData } from '../../domain/value-objects/value-data';
import { isFailure } from '../../common/utils/isFailure';
import { Success } from '../../common/interfaces/success';
import { Failure } from '../../common/interfaces/failure';
import { BlockRepositoryInterface } from '../../infrastructure/repositories/block.repository.interface';
import { BlockServiceInterface } from './block.service.interface';

type CreateBlockResult = Success<Block> | Failure;
type ValidateBlockResult = Success<boolean> | Failure;

export class BlockService implements BlockServiceInterface {
  private readonly difficulty: number = 1;

  constructor(private readonly blockRepository: BlockRepositoryInterface) {}

  public async createBlock(valueData: ValueData): Promise<CreateBlockResult> {
    const lastBlockResult = await this.blockRepository.getLastBlock();

    if (isFailure(lastBlockResult)) {
      return lastBlockResult;
    }

    const { data: lastBlock } = lastBlockResult;

    const newBlock = Block.createBlock(valueData, lastBlock?.hash || null);

    newBlock.mine(this.difficulty);

    const savedBlockResult = await this.blockRepository.saveBlock(newBlock);

    if (isFailure(savedBlockResult)) {
      return savedBlockResult;
    }

    return { outcome: 'SUCCESS', data: savedBlockResult.data };
  }

  public isBlockValid = async (block: Block): Promise<ValidateBlockResult> => {
    const previousBlocksResult = await this.blockRepository.getBlocksBefore(
      block.timestamp,
    );

    if (isFailure(previousBlocksResult)) {
      return previousBlocksResult;
    }

    const { data: previousBlocks } = previousBlocksResult;
    const result = this.checkBlock(block, previousBlocks);

    return {
      outcome: 'SUCCESS',
      data: result,
    };
  };

  private checkBlock = (block: Block, previousBlocks: Block[]): boolean => {
    if (block.hash === null) {
      return true;
    }

    const previousBlock = previousBlocks.find(
      (prevBlock) => prevBlock.hash === block.previousHash,
    );

    if (
      !previousBlock ||
      block.hash !== block.calculateHash() ||
      previousBlock.hash !== block.previousHash
    ) {
      return false;
    }

    return this.checkBlock(
      previousBlock,
      previousBlocks.filter(
        (prevBlock) => prevBlock.hash !== previousBlock.hash,
      ),
    );
  };
}
