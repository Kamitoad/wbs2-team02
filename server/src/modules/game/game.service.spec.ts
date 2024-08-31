import { Test, TestingModule } from '@nestjs/testing';
import { GameService } from './game.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from '../../database/Game';  // Angepasster Import

describe('GameService', () => {
    let service: GameService;
    let repository: Repository<Game>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GameService,
                {
                    provide: getRepositoryToken(Game),
                    useClass: Repository,
                },
            ],
        }).compile();

        service = module.get<GameService>(GameService);
        repository = module.get<Repository<Game>>(getRepositoryToken(Game));
    });

    it('should create a game and set createdAt field', async () => {
        const player1Id = 1;
        const player2Id = 2;

        // Mock the repository save method
        const saveSpy = jest.spyOn(repository, 'save').mockResolvedValue({
            gameId: 1,
            player1: { userId: player1Id },  // `player1Id` wird korrekt verwendet
            player2: { userId: player2Id },  // `player2Id` wird korrekt verwendet
            createdAt: new Date().toISOString(),  // Das `createdAt`-Feld als String im ISO-Format
            // Weitere Felder...
        } as Game);

        const game = await service.createGame(player1Id, player2Id);

        expect(saveSpy).toHaveBeenCalled();
        expect(typeof game.createdAt).toBe('string');
        expect(new Date(game.createdAt).toISOString()).toBe(game.createdAt);
        expect(game.player1.userId).toBe(player1Id);
        expect(game.player2.userId).toBe(player2Id);
    });
});
