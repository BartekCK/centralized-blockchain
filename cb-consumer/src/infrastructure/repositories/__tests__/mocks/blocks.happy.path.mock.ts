import { Block } from '../../../../domain/entities/block.entity';
import { ValueData } from '../../../../domain/value-objects/value-data';
import { sleep } from '../../../../common/utils/sleep';

export const createBlocksSyncHappyPath = async (): Promise<Block[]> => {
  const blocks: Block[] = [];

  for (let i = 0; i < 15; i++) {
    const valueData = new ValueData('Ala ma kota');

    const block = Block.createBlock(valueData, blocks[i - 1]?.hash || null);
    block.mine(0);

    await sleep(100);

    blocks.push(block);
  }

  return blocks;
};
