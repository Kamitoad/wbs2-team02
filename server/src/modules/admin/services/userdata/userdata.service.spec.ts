import { Test, TestingModule } from '@nestjs/testing';
import { UserdataService } from './userdata.service';

describe('UserdataService', () => {
  let provider: UserdataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserdataService],
    }).compile();

    provider = module.get<UserdataService>(UserdataService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
