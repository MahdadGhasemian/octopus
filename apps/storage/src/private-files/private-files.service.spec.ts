import { Test, TestingModule } from '@nestjs/testing';
import { PrivateFilesService } from './private-files.service';

describe('PrivateFilesService', () => {
  let service: PrivateFilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrivateFilesService],
    }).compile();

    service = module.get<PrivateFilesService>(PrivateFilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
