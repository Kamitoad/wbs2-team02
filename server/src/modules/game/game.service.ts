import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository, Not} from 'typeorm';
import {Game} from '../../database/Game';
import {User} from '../../database/User';
import {FieldStateEnum} from '../../database/enums/FieldStateEnum';

@Injectable()
export class GameService {
    constructor(
        @InjectRepository(Game)
        private readonly gameRepository: Repository<Game>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {
    }

    // Erstellt ein neues Spiel mit zwei Spielern
    async createGame(player1Id: number, player2Id: number): Promise<Game> {
        const player1 = await this.userRepository.findOne({where: {userId: player1Id}});
        const player2 = await this.userRepository.findOne({where: {userId: player2Id}});

        if (!player1 || !player2) {
            throw new NotFoundException('One or both players not found');
        }

        const game = new Game();
        game.player1 = player1;
        game.player2 = player2;
        game.currentTurn = Math.random() > 0.5 ? 'player1' : 'player2';
        game.hasEnded = 0;

        return this.gameRepository.save(game);
    }

    // Ruft ein Spiel anhand der ID ab
    async getGameById(id: number): Promise<Game> {
        const game = await this.gameRepository.findOne({where: {gameId: id}});

        if (!game) {
            throw new NotFoundException('Game not found');
        }

        return game;
    }

    // Aktualisiert ein Spiel mit dem Ergebnis und dem Elo-Wert für Spieler 1
    async updateGameWithResult(id: number, winner: number, changeEloPlayer1: number): Promise<Game> {
        const game = await this.getGameById(id);

        game.winner = winner;
        game.changeEloPlayer1 = changeEloPlayer1;
        game.hasEnded = 1;

        return this.gameRepository.save(game);
    }

    // Findet ein bestehendes Spiel oder erstellt ein neues, wenn keines gefunden wird
    async createOrFindGame(player1Id: number): Promise<Game> {
        // Suche nach einem bestehenden Spiel, bei dem player2 noch nicht gesetzt ist
        let game = await this.gameRepository.findOne({
            where: { player2: null, hasEnded: 0 },
            relations: ['player1', 'player2'], // Stelle sicher, dass die Beziehungen geladen werden
        });

        if (game) {
            // Überprüfen, ob player1 korrekt gefunden wurde
            const player1 = await this.userRepository.findOne({ where: { userId: player1Id } });

            if (!player1) {
                throw new NotFoundException('Player 1 not found');
            }

            // Stelle sicher, dass die Spieler nicht gleich sind
            if (game.player1.userId === player1Id) {
                // Finde einen anderen Spieler als player2
                const otherPlayers = await this.userRepository.find({
                    where: { userId: Not(player1Id) },
                });

                if (otherPlayers.length === 0) {
                    throw new Error('No other players available to join the game.');
                }

                // Wähle einen zufälligen anderen Spieler als player2
                const player2 = otherPlayers[Math.floor(Math.random() * otherPlayers.length)];

                console.log('Assigning player2:', player2.userId);

                game.player2 = player2;
                game.currentTurn = Math.random() > 0.5 ? 'player1' : 'player2';
                return this.gameRepository.save(game);
            } else {
                throw new Error('Player 1 is already assigned to this game.');
            }
        } else {
            // Erstelle ein neues Spiel, wenn keins verfügbar ist
            const player1 = await this.userRepository.findOne({ where: { userId: player1Id } });

            if (!player1) {
                throw new NotFoundException('Player 1 not found');
            }

            game = new Game();
            game.player1 = player1;
            game.currentTurn = 'player1'; // Der erste Spieler beginnt
            game.hasEnded = 0;
            game.createdAt = new Date().toISOString();

            console.log('Creating new game with player1:', player1.userId);

            return this.gameRepository.save(game);
        }
    }

    // Verarbeitet den Zug eines Spielers
    async processPlayerMove(gameId: number, move: { field: string; value: number }): Promise<Game> {
        const game = await this.getGameById(gameId);

        if (game.hasEnded) {
            throw new Error('Game already ended');
        }

        if (game[move.field] !== FieldStateEnum.NotFilled) {
            throw new Error('Invalid move: The field is already filled');
        }

        // Setzt das Feld auf den Wert des aktuellen Spielers
        game[move.field] = move.value === 1 ? FieldStateEnum.FilledByPlayer1 : FieldStateEnum.FilledByPlayer2;

        // Überprüfe, ob das Spiel nach diesem Zug gewonnen wurde (hier könnte eine Logik für die Gewinnbedingungen hinzugefügt werden)

        // Update den aktuellen Zug, wenn das Spiel nicht beendet ist
        if (!game.hasEnded) {
            game.currentTurn = game.currentTurn === 'player1' ? 'player2' : 'player1';
        }

        return this.gameRepository.save(game);
    }
}