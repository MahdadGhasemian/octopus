import { Test, TestingModule } from '@nestjs/testing';
import { AccessesService } from './accesses.service';

describe('AccessesService', () => {
  let service: AccessesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccessesService],
    }).compile();

    service = module.get<AccessesService>(AccessesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
