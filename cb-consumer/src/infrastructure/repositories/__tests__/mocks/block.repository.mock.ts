import { BlockRepositoryInterface } from '../../block.repository.interface';
import { Block } from '../../../../domain/entities/block.entity';
import { createSuccessMock } from '../../../../common/__tests__/mocks/createSuccess.mock';

export class BlockRepositoryMock implements BlockRepositoryInterface {
  getBlockByHash = jest.fn();

  getBlocksBefore = jest.fn();

  getLastBlock = jest.fn();

  saveBlock = jest.fn().mockImplementation((block: Block) => {
    return createSuccessMock(block);
  });
}
