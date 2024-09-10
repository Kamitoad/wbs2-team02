import { Test, TestingModule } from '@nestjs/testing';
import { QueueService } from './queue.service';

describe('QueueService', () => {
  let provider: QueueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QueueService],
    }).compile();

    provider = module.get<QueueService>(QueueService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
