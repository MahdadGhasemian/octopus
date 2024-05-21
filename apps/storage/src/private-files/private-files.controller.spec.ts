import { Test, TestingModule } from '@nestjs/testing';
import { PrivateFilesController } from './private-files.controller';
import { PrivateFilesService } from './private-files.service';

describe('PrivateFilesController', () => {
  let controller: PrivateFilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrivateFilesController],
      providers: [PrivateFilesService],
    }).compile();

    controller = module.get<PrivateFilesController>(PrivateFilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
