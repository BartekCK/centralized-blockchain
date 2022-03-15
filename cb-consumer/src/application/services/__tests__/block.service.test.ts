import { BlockRepositoryInterface } from '../../../infrastructure/repositories/block.repository.interface';
import { BlockRepositoryMock } from '../../../infrastructure/repositories/__tests__/mocks/block.repository.mock';
import { BlockService } from '../block.service';
import { createSuccessMock } from '../../../common/__tests__/mocks/createSuccess.mock';
import { createBlockMock } from '../../../domain/entities/__tests__/mocks/block.mock';
import { ValueData } from '../../../domain/value-objects/value-data';
import { isSuccessAssert } from '../../../common/__tests__/helpers/isSuccessAssert';
import { isFailureAssert } from '../../../common/__tests__/helpers/isFailureAssert';
import { createBlocksSyncHappyPath } from '../../../domain/entities/__tests__/mocks/blocks.happy.path.mock';

describe('Block service tests', () => {
  let blockRepository: BlockRepositoryInterface;
  let blockService: BlockService;

  beforeEach(() => {
    blockRepository = new BlockRepositoryMock();
    blockService = new BlockService(blockRepository);
  });

  describe('"createBlock" method', () => {
    it('should create block', async () => {
      const lastBlockResult = createSuccessMock(createBlockMock());
      const valueData = new ValueData('Ala ma kota');

      jest
        .spyOn(blockRepository, 'getLastBlock')
        .mockResolvedValue(lastBlockResult);

      const result = await blockService.createBlock(valueData);

      isSuccessAssert(result);
      expect(blockRepository.saveBlock).toBeCalledTimes(1);
      expect(result.data.previousHash).toStrictEqual(lastBlockResult.data.hash);
    });

    it('should return "FAILURE" if unknown error with last block occurred', async () => {
      const valueData = new ValueData('Ala ma kota');

      jest.spyOn(blockRepository, 'getLastBlock').mockResolvedValue({
        outcome: 'FAILURE',
        errorCode: 'DATABASE_UNKNOWN_ERROR',
      });

      const result = await blockService.createBlock(valueData);

      isFailureAssert(result);
      expect(blockRepository.saveBlock).toBeCalledTimes(0);
    });

    it('should return "FAILURE" if unknown error with saving block occurred', async () => {
      const lastBlockResult = createSuccessMock(createBlockMock());
      const valueData = new ValueData('Ala ma kota');

      jest
        .spyOn(blockRepository, 'getLastBlock')
        .mockResolvedValue(lastBlockResult);
      jest.spyOn(blockRepository, 'saveBlock').mockResolvedValue({
        outcome: 'FAILURE',
        errorCode: 'DATABASE_UNKNOWN_ERROR',
      });

      const result = await blockService.createBlock(valueData);

      isFailureAssert(result);
      expect(blockRepository.saveBlock).toBeCalledTimes(1);
    });
  });

  describe('"isBlockValid" method', () => {
    it('new crated block should be valid', async () => {
      const blocks = await createBlocksSyncHappyPath();
      const lastBlock = blocks.pop();
      const blocksBeforeResult = createSuccessMock(blocks);

      jest
        .spyOn(blockRepository, 'getBlocksBefore')
        .mockResolvedValue(blocksBeforeResult);

      const result = await blockService.isBlockValid(lastBlock!);

      isSuccessAssert(result);
      expect(result.data).toBeTruthy();
    });

    it(`new crated block shouldn't be valid`, async () => {
      const blocks = await createBlocksSyncHappyPath();
      const lastBlock = blocks.pop();
      const blocksBeforeResult = createSuccessMock(blocks);

      // @ts-ignore
      blocks[Math.round(blocks.length / 2)].data._message = 'dd';

      jest
        .spyOn(blockRepository, 'getBlocksBefore')
        .mockResolvedValue(blocksBeforeResult);

      const result = await blockService.isBlockValid(lastBlock!);

      isSuccessAssert(result);
      expect(result.data).toBeFalsy();
    });

    it('should return "FAILURE" if unknown error with blocks before occurred', async () => {
      jest.spyOn(blockRepository, 'getBlocksBefore').mockResolvedValue({
        outcome: 'FAILURE',
        errorCode: 'DATABASE_UNKNOWN_ERROR',
      });

      const result = await blockService.isBlockValid(createBlockMock());

      isFailureAssert(result);
    });
  });
});
