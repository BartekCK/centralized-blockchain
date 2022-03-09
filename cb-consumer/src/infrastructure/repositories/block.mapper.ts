import { BlockDbDetails } from './block.details';
import { Block } from '../../domain/entities/block.entity';
import { ValueData } from '../../domain/value-objects/value-data';

export abstract class BlockMapper {
  static mapBlockDbDetailsToBlock(blockDbDetails: BlockDbDetails): Block {
    const { timestamp, hash, data, pow, previousHash } = blockDbDetails;

    const valueData = new ValueData(data);

    return Block.createMinedBlock({
      pow,
      hash,
      previousHash,
      timestamp,
      data: valueData,
    });
  }
}
