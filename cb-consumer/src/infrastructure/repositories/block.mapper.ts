import { BlockDbDetails } from './block.details';
import { Block } from '../../domain/entities/block.entity';
import { ValueData } from '../../domain/value-objects/value-data';

export abstract class BlockMapper {
  static mapBlockDbDetailsToBlock(blockDbDetails: BlockDbDetails): Block {
    const { timestamp, hash, data, pow, previous_hash } = blockDbDetails;

    const valueData = new ValueData(data);

    return Block.createMinedBlock({
      pow,
      hash,
      previousHash: previous_hash,
      timestamp: timestamp.getTime(),
      data: valueData,
    });
  }

  static mapBlockToBlockDbDetails(
    block: Block,
  ): Omit<BlockDbDetails, 'id' | 'created_at' | 'updated_at'> {
    return {
      pow: block.pow,
      hash: block.hash,
      data: block.data.message,
      previous_hash: block.previousHash,
      timestamp: new Date(block.timestamp),
    };
  }
}
