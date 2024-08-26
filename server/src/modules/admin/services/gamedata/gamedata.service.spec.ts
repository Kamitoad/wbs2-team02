import { Test, TestingModule } from '@nestjs/testing';
import { GamedataService } from './gamedata.service';

describe('GamedataService', () => {
  let provider: GamedataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GamedataService],
    }).compile();

    provider = module.get<GamedataService>(GamedataService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
