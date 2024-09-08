import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Game} from '../../../../database/Game';
import {User} from '../../../../database/User'; // Importiere User, um die Spieler zu setzen
import {FieldStateEnum} from '../../../../database/enums/FieldStateEnum';

interface GameFields {
    [key: string]: FieldStateEnum;
}

@Injectable()
export class GameService {
    constructor(
        @InjectRepository(Game)
        private gameRepository: Repository<Game>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {
    }

    async getGameById(gameId: number): Promise<Game> {
        return this.gameRepository.findOne({where: {gameId}});
    }

    async makeMove(gameId: number, playerId: number, move: { x: number, y: number }): Promise<void> {
        const game = await this.gameRepository.findOne({
            where: {gameId},
            relations: ['player1', 'player2', 'currentPlayer1', 'currentPlayer2']
        });

        if (!game) {
            throw new NotFoundException('Spiel nicht gefunden');
        }

        if ((game.currentPlayer1 && game.currentPlayer1.userId !== playerId) ||
            (game.currentPlayer2 && game.currentPlayer2.userId !== playerId)) {
            throw new BadRequestException('Du bist nicht an der Reihe.');
        }

        const fieldKey = `field${move.x}_${move.y}` as keyof GameFields;

        // Nutze Typ Assertion um sicherzustellen, dass das Feld vom Typ FieldStateEnum ist
        if ((game[fieldKey] as FieldStateEnum) !== FieldStateEnum.NotFilled) {
            throw new BadRequestException('Das Feld ist bereits belegt');
        }

        game[fieldKey] = game.player1.userId === playerId ? FieldStateEnum.FilledByPlayer1 : FieldStateEnum.FilledByPlayer2;
        await this.gameRepository.save(game);

        const winner = await this.checkWinner(game);
        if (winner) {
            const winnerEnum = FieldStateEnum[winner as keyof typeof FieldStateEnum];
            await this.endGame(gameId, playerId, winnerEnum === FieldStateEnum.FilledByPlayer1 ? game.player2.userId : game.player1.userId);
            return;
        }

        if (game.currentPlayer1 && game.currentPlayer1.userId === playerId) {
            game.currentPlayer1 = null;
            game.currentPlayer2 = game.player2;
        } else if (game.currentPlayer2 && game.currentPlayer2.userId === playerId) {
            game.currentPlayer2 = null;
            game.currentPlayer1 = game.player1;
        } else {
            throw new BadRequestException('Ungültiger Spieler');
        }

        await this.gameRepository.save(game);
    }

    async checkWinner(game: Game): Promise<'Player1' | 'Player2' | 'Tie' | null> {
        const winningCombinations = [
            ['field1_1', 'field1_2', 'field1_3'],
            ['field2_1', 'field2_2', 'field2_3'],
            ['field3_1', 'field3_2', 'field3_3'],
            ['field1_1', 'field2_1', 'field3_1'],
            ['field1_2', 'field2_2', 'field3_2'],
            ['field1_3', 'field2_3', 'field3_3'],
            ['field1_1', 'field2_2', 'field3_3'],
            ['field1_3', 'field2_2', 'field3_1'],
        ];

        for (const combination of winningCombinations) {
            const [a, b, c] = combination;

            // Typ Assertion um den Typ des Feldes sicherzustellen
            if (game[a as keyof GameFields] !== FieldStateEnum.NotFilled &&
                game[a as keyof GameFields] === game[b as keyof GameFields] &&
                game[a as keyof GameFields] === game[c as keyof GameFields]) {
                return game[a as keyof GameFields] === FieldStateEnum.FilledByPlayer1 ? 'Player1' : 'Player2';
            }
        }

        // Unentschieden prüfen
        const allFieldsFilled = Object.keys(game).every((key) => {
            if (key.startsWith('field')) {
                return game[key as keyof GameFields] !== FieldStateEnum.NotFilled;
            }
            return true;
        });

        if (allFieldsFilled) {
            return 'Tie'; // Unentschieden
        }

        return null;
    }

    async endGame(gameId: number, winnerId: number | null, loserId: number | null): Promise<void> {
        const game = await this.gameRepository.findOne({where: {gameId}, relations: ['player1', 'player2']});
        if (!game) {
            throw new NotFoundException('Spiel nicht gefunden');
        }

        game.hasEnded = true;

        if (winnerId && loserId) {
            game.winner = winnerId;
            game.loser = loserId;
            await this.updateEloForPlayers(winnerId, loserId);
            await this.updatePlayerStats(winnerId, loserId);
        } else {
            // Unentschieden: Elo für beide Spieler aktualisieren
            await this.updateEloForTie(game.player1.userId, game.player2.userId);
            await this.updatePlayerStatsForTie(game.player1.userId, game.player2.userId);
        }

        await this.gameRepository.save(game);
    }

    async resignGame(gameId: number, playerId: number): Promise<void> {
        const game = await this.findGameById(gameId);

        const opponentId = game.player1.userId === playerId ? game.player2.userId : game.player1.userId;

        game.hasEnded = true;
        game.winner = opponentId;

        await this.updateEloForPlayers(opponentId, playerId);
        await this.gameRepository.save(game);
    }

    private async findGameById(gameId: number): Promise<Game> {
        const game = await this.gameRepository.findOne({where: {gameId}});
        if (!game) {
            throw new NotFoundException('Spiel nicht gefunden');
        }
        return game;
    }

    async updateEloForPlayers(winnerId: number, loserId: number): Promise<void> {
        const winner = await this.userRepository.findOne({where: {userId: winnerId}});
        const loser = await this.userRepository.findOne({where: {userId: loserId}});

        if (winner && loser) {
            // Berechne die Elo-Änderung
            const winnerEloChange = calculateEloChange(winner.elo, loser.elo, 1); // Gewinner hat Score 1
            const loserEloChange = calculateEloChange(loser.elo, winner.elo, 0);  // Verlierer hat Score 0

            // Elo für Gewinner und Verlierer aktualisieren
            winner.elo += winnerEloChange;
            loser.elo += loserEloChange;

            await this.userRepository.save(winner);
            await this.userRepository.save(loser);
        }
    }

    async updatePlayerStats(winnerId: number, loserId: number): Promise<void> {
        const winner = await this.userRepository.findOne({where: {userId: winnerId}});
        const loser = await this.userRepository.findOne({where: {userId: loserId}});

        if (winner) {
            winner.totalWins += 1;
        }

        if (loser) {
            loser.totalLosses += 1;
        }

        await this.userRepository.save(winner);
        await this.userRepository.save(loser);
    }

    async updatePlayerStatsForTie(player1Id: number, player2Id: number): Promise<void> {
        const player1 = await this.userRepository.findOne({where: {userId: player1Id}});
        const player2 = await this.userRepository.findOne({where: {userId: player2Id}});

        if (player1) {
            player1.totalTies += 1;
        }

        if (player2) {
            player2.totalTies += 1;
        }

        await this.userRepository.save(player1);
        await this.userRepository.save(player2);
    }

    async updateEloForTie(player1Id: number, player2Id: number): Promise<void> {
        const player1 = await this.userRepository.findOne({where: {userId: player1Id}});
        const player2 = await this.userRepository.findOne({where: {userId: player2Id}});

        if (player1 && player2) {
            const player1EloChange = calculateEloChange(player1.elo, player2.elo, 0.5); // Unentschieden Score = 0.5
            const player2EloChange = calculateEloChange(player2.elo, player1.elo, 0.5); // Unentschieden Score = 0.5

            // Elo für beide Spieler aktualisieren
            player1.elo += player1EloChange;
            player2.elo += player2EloChange;

            await this.userRepository.save(player1);
            await this.userRepository.save(player2);
        }
    }

}

// Elo-Berechnungsmethode
function calculateEloChange(playerElo: number, opponentElo: number, score: number): number {
    const k = 20; // Anpassungsfaktor
    return k * (score - (1 / (1 + Math.pow(10, (opponentElo - playerElo) / 400))));
}





