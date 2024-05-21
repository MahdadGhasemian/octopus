import { Test, TestingModule } from '@nestjs/testing';
import { PublicFilesService } from './public-files.service';

describe('PublicFilesService', () => {
  let service: PublicFilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PublicFilesService],
    }).compile();

    service = module.get<PublicFilesService>(PublicFilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
