import { Test, TestingModule } from '@nestjs/testing';
import { AccessesController } from './accesses.controller';
import { AccessesService } from './accesses.service';

describe('AccessesController', () => {
  let controller: AccessesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccessesController],
      providers: [AccessesService],
    }).compile();

    controller = module.get<AccessesController>(AccessesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
