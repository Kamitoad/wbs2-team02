import { Test, TestingModule } from '@nestjs/testing';
import { GamedataGateway } from './gamedata.gateway';

describe('GamedataGateway', () => {
  let gateway: GamedataGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GamedataGateway],
    }).compile();

    gateway = module.get<GamedataGateway>(GamedataGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
