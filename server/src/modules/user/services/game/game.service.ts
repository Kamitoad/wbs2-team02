import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Game} from '../../../../database/Game';
import {User} from '../../../../database/User'; // Importiere User, um die Spieler zu setzen
import {FieldStateEnum} from '../../../../database/enums/FieldStateEnum';

@Injectable()
export class GameService {
    constructor(
        @InjectRepository(Game)
        private gameRepository: Repository<Game>,
        @InjectRepository(User)
        private userRepository: Repository<User>, // Repository für User
    ) {
    }

    async getGameById(gameId: number): Promise<Game> {
        const GameID = await this.gameRepository.findOne({where: {gameId: gameId}});
        return GameID;
    }

    // Diese Methode überprüft, ob der Zug gültig ist (z.B. ob das Feld bereits belegt ist), und speichert den neuen Zustand.
    async makeMove(gameId: number, playerId: number, move: { x: number, y: number }): Promise<void> {
        const game = await this.gameRepository.findOne({where: {gameId}});
        if (!game) {
            throw new NotFoundException('Spiel nicht gefunden');
        }

        // Beispiel für die Zuordnung des Spielfelds:
        const fieldKey = `field${move.x}_${move.y}`;
        if (game[fieldKey] !== null) {
            throw new BadRequestException('Das Feld ist bereits belegt');
        }

        // Spieler 1 = X, Spieler 2 = O
        // Methode ist nicht Redudant?
        /*
        const fieldValue = game.player1.userId === playerId ? FieldStateEnum.FilledByPlayer1 : FieldStateEnum.FilledByPlayer2;
        game[fieldKey] = fieldValue;
        */
        game[fieldKey] = game.player1.userId === playerId ? FieldStateEnum.FilledByPlayer1 : FieldStateEnum.FilledByPlayer2;

        await this.gameRepository.save(game);

        // Prüfe auf Gewinner
        const winner = await this.checkWinner(game);
        if (winner) {
            await this.endGame(gameId, playerId, winner === 'X' ? game.player2.userId : game.player1.userId);
        }
    }

    // Diese Methode prüft nach jedem Zug, ob einer der Spieler gewonnen hat.
    async checkWinner(game: Game): Promise<'X' | 'O' | null> {
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
            if (game[a] && game[a] === game[b] && game[a] === game[c]) {
                return game[a];  // 'X' oder 'O'
            }
        }
        return null;
    }

    // EndGame-Methode
    async endGame(gameId: number, winnerId: number, loserId: number): Promise<void> {
        const game = await this.gameRepository.findOne({ where: { gameId } });
        if (!game) {
            throw new NotFoundException('Spiel nicht gefunden');
        }

        game.hasEnded = true;
        game.winner = winnerId;
        game.loser = loserId; // Stelle sicher, dass du auch die Verlierer-ID speicherst, falls benötigt

        await this.gameRepository.save(game);

        // Rufe die updateElo-Methode auf
        await this.updateElo(gameId);
    }

    async resignGame(gameId: number, playerId: number): Promise<void> {
        const game = await this.gameRepository.findOne({where: {gameId}});
        if (!game) {
            throw new NotFoundException('Spiel nicht gefunden');
        }

        // Bestimme den Gegner
        const opponentId = game.player1.userId === playerId ? game.player2.userId : game.player1.userId;

        // Setze das Spiel als beendet und den Sieger auf den Gegner
        game.hasEnded = true;
        game.winner = opponentId;

        // Elo-Werte anpassen
        const winner = await this.userRepository.findOne({where: {userId: opponentId}});
        const loser = await this.userRepository.findOne({where: {userId: playerId}});

        if (winner && loser) {
            const newWinnerElo = winner.elo + 10;
            const newLoserElo = loser.elo - 10;

            winner.elo = newWinnerElo;
            loser.elo = newLoserElo;

            await this.userRepository.save(winner);
            await this.userRepository.save(loser);
        }

        await this.gameRepository.save(game);
    }

    // Definiere die updateElo-Methode
    async updateElo(gameId: number): Promise<void> {
        const game = await this.gameRepository.findOne({ where: { gameId } });
        if (!game) {
            throw new NotFoundException('Spiel nicht gefunden');
        }

        const winnerId = game.winner;
        const loserId = game.loser;

        if (!winnerId || !loserId) {
            throw new BadRequestException('Fehlende Gewinner- oder Verlierer-ID');
        }

        const winner = await this.userRepository.findOne({ where: { userId: winnerId } });
        const loser = await this.userRepository.findOne({ where: { userId: loserId } });

        if (winner && loser) {
            const newWinnerElo = winner.elo + 10; // Beispielhafte Elo-Berechnung
            const newLoserElo = loser.elo - 10;

            winner.elo = newWinnerElo;
            loser.elo = newLoserElo;

            await this.userRepository.save(winner);
            await this.userRepository.save(loser);
        }
    }



}
