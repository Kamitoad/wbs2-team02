import { Test, TestingModule } from '@nestjs/testing';
import { GamedataController } from './gamedata.controller';

describe('GamedataController', () => {
  let controller: GamedataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GamedataController],
    }).compile();

    controller = module.get<GamedataController>(GamedataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
