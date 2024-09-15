import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Game} from '../../../../database/Game';
import {User} from '../../../../database/User'; // Importiere User, um die Spieler zu setzen
import {FieldStateEnum} from '../../../../database/enums/FieldStateEnum';
import {GamedataGateway} from "../../../admin/gateways/gamedata/gamedata.gateway";

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

        private gamedataGateway: GamedataGateway,
    ) {
    }

    async getGame(gameId: number, userId: number): Promise<Game> {
        const game = await this.getGameById(gameId);
        if (!game) {
            throw new NotFoundException('Spiel nicht gefunden');
        }

        if (game.hasEnded) {
            throw new BadRequestException('Spiel ist vorbei');
        }

        if (game.player1.userId !== userId && game.player2.userId !== userId) {
            throw new BadRequestException('Du bist kein Mitspieler');
        }

        return game
    }

    async getGameById(gameId: number): Promise<Game> {
        return this.gameRepository.findOne({
            where: {gameId},
            relations: ['player1', 'player2']
        });
    }

    async makeMove(gameId: number, playerId: number, move: { x: number, y: number }): Promise<any> {
        console.log("make a Move")
        const game = await this.getGameById(gameId);

        if (!game) {
            throw new NotFoundException('Spiel nicht gefunden');
        }

        if (game.hasEnded) {
            throw new BadRequestException('Spiel wurde beendet');
        }

        console.log(game.currentPlayer)
        console.log(playerId)

        // Überprüfung, ob der aktuelle Spieler am Zug ist
        if (game.currentPlayer !== playerId) {
            throw new BadRequestException('Du bist nicht an der Reihe.');
        }

        const fieldKey = `field${move.x}_${move.y}` as keyof GameFields;

        // Überprüfung, ob das gewählte Feld bereits belegt ist
        if ((game[fieldKey] as FieldStateEnum) !== FieldStateEnum.NotFilled) {
            throw new BadRequestException('Das Feld ist bereits belegt');
        }

        // Setze den Zug auf dem Spielfeld
        game[fieldKey] = game.player1.userId === playerId ? FieldStateEnum.FilledByPlayer1 : FieldStateEnum.FilledByPlayer2;

        await this.gameRepository.save(game);

        // Überprüfung auf Gewinner oder Unentschieden
        const winner = await this.checkWinner(game);

        console.log("before Winner check")
        if (winner === 'Player1') {
            console.log('Player1 is Winner', gameId);
            return await this.endGame(gameId, game.player1.userId, game.player2.userId); // Spieler 1 hat gewonnen
        } else if (winner === 'Player2') {
            console.log('Player2 is Winner', gameId);
            return await this.endGame(gameId, game.player2.userId, game.player1.userId); // Spieler 2 hat gewonnen
        } else if (winner === 'Tie') {
            console.log('GAME IS TIE');
            return await this.endGame(gameId, null, null); // Unentschieden
        }

        // Change currentPlayer
        if (game.currentPlayer == game.player1.userId) {
            game.currentPlayer = game.player2.userId
        } else if (game.currentPlayer == game.player2.userId) {
            game.currentPlayer = game.player1.userId;
        } else {
            throw new BadRequestException('Ungültiger Spieler');
        }

        await this.gameRepository.save(game);

        return game;
    }

    async checkWinner(game: Game): Promise<'Player1' | 'Player2' | 'Tie' | null> {
        const winningCombinations = [
            ['field0_0', 'field0_1', 'field0_2'],
            ['field1_0', 'field1_1', 'field1_2'],
            ['field2_0', 'field2_1', 'field2_2'],
            ['field0_0', 'field1_0', 'field2_0'],
            ['field0_1', 'field1_1', 'field2_1'],
            ['field0_2', 'field1_2', 'field2_2'],
            ['field0_0', 'field1_1', 'field2_2'],
            ['field0_2', 'field1_1', 'field2_0'],
        ];

        // Checks the values of a, b, c if they are the same
        // Example: a, b, c of winningCombinations are all filled by player1
        for (const combination of winningCombinations) {
            const [a, b, c] = combination;

            if (
                game[a as keyof GameFields] !== FieldStateEnum.NotFilled &&
                game[a as keyof GameFields] === game[b as keyof GameFields] &&
                game[a as keyof GameFields] === game[c as keyof GameFields]
            ) {
                return game[a as keyof GameFields] === FieldStateEnum.FilledByPlayer1 ? 'Player1' : 'Player2';
            }
        }

        const allFieldsFilled = Object.keys(game).every((key) => {
            if (key.startsWith('field')) {
                return game[key as keyof GameFields] !== FieldStateEnum.NotFilled;
            }
            return true;
        });

        if (allFieldsFilled) {
            console.log('Game is Tie');
            return 'Tie';
        }

        return null;
    }


    async endGame(gameId: number, winnerId: number | null, loserId: number | null): Promise<any> {
        console.log("endGame");
        const game = await this.gameRepository.findOne({where: {gameId}, relations: ['player1', 'player2']});
        if (!game) {
            throw new NotFoundException('Spiel nicht gefunden');
        }

        game.hasEnded = true;

        if (winnerId && loserId) {
            game.winner = winnerId; // Korrekt setzen
            game.loser = loserId; // Korrekt setzen
            console.log('Gewinner:', winnerId);
            console.log('Verlierer:', loserId);

            //TODO: Update changeElo in Game DB
            await this.updateEloForPlayers(winnerId, loserId, game);
            await this.updatePlayerStats(winnerId, loserId);

            this.gamedataGateway.notifyWinner(game.gameId, game.winner);
            this.gamedataGateway.notifyLoser(game.gameId, game.loser);
        } else {
            // Unentschieden: Elo für beide Spieler aktualisieren
            game.isTie = true;
            this.gamedataGateway.notifyTie(game.gameId);
            //TODO: Update changeElo in Game DB
            await this.updateEloForTie(game.player1.userId, game.player2.userId, game);
            await this.updatePlayerStatsForTie(game.player1.userId, game.player2.userId);
        }
        console.log('Gewinner AFTER:', winnerId);
        console.log('Verlierer AFTER:', loserId);

        await this.gameRepository.save(game);

        this.gamedataGateway.notifyGameEnded(game.gameId);

        return game;
    }

    async resignGame(gameId: number, playerId: number): Promise<any> {
        const game = await this.findGameById(gameId);

        const opponentId = game.player1.userId === playerId ? game.player2.userId : game.player1.userId;

        game.hasEnded = true;
        game.winner = opponentId;
        game.loser = playerId;

        await this.updateEloForPlayers(opponentId, playerId, game);
        await this.updatePlayerStats(opponentId, playerId);

        await this.gameRepository.save(game);

        return game;
    }

    private async findGameById(gameId: number): Promise<Game> {
        const game = await this.gameRepository.findOne({where: {gameId}});
        if (!game) {
            throw new NotFoundException('Spiel nicht gefunden');
        }
        return game;
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

    async updateEloForPlayers(winnerId: number, loserId: number, game: any): Promise<void> {
        const winner = await this.userRepository.findOne({where: {userId: winnerId}});
        const loser = await this.userRepository.findOne({where: {userId: loserId}});

        if (winner && loser) {
            // Berechne die Elo-Änderung
            const winnerEloChange = calculateEloChange(winner.elo, loser.elo, 1); // Gewinner hat Score 1
            const loserEloChange = calculateEloChange(loser.elo, winner.elo, 0);  // Verlierer hat Score 0

            // Elo für Gewinner und Verlierer aktualisieren
            winner.elo += winnerEloChange;
            loser.elo += loserEloChange;

            if (game.player1.userId == winnerId) {
                game.changeEloPlayer1 = winnerEloChange;
                game.changeEloPlayer2 = loserEloChange;
            } else {
                game.changeEloPlayer1 = loserEloChange;
                game.changeEloPlayer2 = winnerEloChange;
            }

            await this.userRepository.save(winner);
            await this.userRepository.save(loser);
        }
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

    async updateEloForTie(player1Id: number, player2Id: number, game: any): Promise<void> {
        const player1 = await this.userRepository.findOne({where: {userId: player1Id}});
        const player2 = await this.userRepository.findOne({where: {userId: player2Id}});

        if (player1 && player2) {
            const player1EloChange = calculateEloChange(player1.elo, player2.elo, 0.5); // Unentschieden Score = 0.5
            const player2EloChange = calculateEloChange(player2.elo, player1.elo, 0.5); // Unentschieden Score = 0.5

            // Elo für beide Spieler aktualisieren
            player1.elo += player1EloChange;
            player2.elo += player2EloChange;

            game.changeEloPlayer1 = player1EloChange;
            game.changeEloPlayer2 = player2EloChange;

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
