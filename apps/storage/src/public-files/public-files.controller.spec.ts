import { Test, TestingModule } from '@nestjs/testing';
import { PublicFilesController } from './public-files.controller';

describe('PublicFilesController', () => {
  let controller: PublicFilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublicFilesController],
    }).compile();

    controller = module.get<PublicFilesController>(PublicFilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
