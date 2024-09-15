import { Test, TestingModule } from '@nestjs/testing';
import { SeedService } from './seed.service';

describe('SeedService', () => {
  let provider: SeedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SeedService],
    }).compile();

    provider = module.get<SeedService>(SeedService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
