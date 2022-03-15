import { Block } from '../../block.entity';
import { ValueData } from '../../../value-objects/value-data';

export const createBlockMock = (): Block => {
  const valueData = new ValueData('Ala ma kota');

  const block = Block.createMinedBlock({
    hash: 'hash',
    previousHash: 'hash',
    pow: 1,
    data: valueData,
    timestamp: Date.now(),
  });

  return block;
};
