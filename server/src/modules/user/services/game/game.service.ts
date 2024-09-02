import {Injectable, NotFoundException, BadRequestException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Game} from '../../../../database/Game';
import {Move} from '../../../../database/move.entity';
import {CreateGameDto} from '../../dtos/game/create-game.dto';
import {MakeMoveDto} from '../../dtos/game/make-move.dto';
import {User} from '../../../../database/User';
import {FieldStateEnum} from '../../../../database/enums/FieldStateEnum';
import {PlayerEnum} from '../../../../database/enums/PlayerEnum';

@Injectable()
export class GameService {
    constructor(
        @InjectRepository(Game)
        private gameRepository: Repository<Game>,
        @InjectRepository(Move)
        private moveRepository: Repository<Move>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {
    }

    async createGame(createGameDto: CreateGameDto): Promise<Game> {
        const player1 = await this.userRepository.findOne({where: {userId: createGameDto.player1Id}});
        const player2 = await this.userRepository.findOne({where: {userId: createGameDto.player2Id}});

        if (!player1 || !player2) {
            throw new NotFoundException('Player not found');
        }

        const game = this.gameRepository.create({
            player1,
            player2,
            currentTurn: PlayerEnum.Player1,
        });

        return this.gameRepository.save(game);
    }

    async makeMove(gameId: number, makeMoveDto: MakeMoveDto): Promise<Game> {
        const game = await this.gameRepository.findOne({where: {gameId}, relations: ['moves']});

        if (!game) {
            throw new NotFoundException('Game not found');
        }

        if (game.hasEnded) {
            throw new BadRequestException('Game has already ended');
        }

        if (game.currentTurn !== makeMoveDto.player) {
            throw new BadRequestException('It is not your turn');
        }

        // Überprüfe, ob der Zug gültig ist
        function updateGameField(game: Game, key: string, value: FieldStateEnum) {
            if (key in game) {
                (game as any)[key] = value;
            } else {
                throw new Error(`Invalid field key: ${key}`);
            }
        }
        // Verwendung
        const fieldKey = `field${makeMoveDto.x}_${makeMoveDto.y}`;
        updateGameField(game, fieldKey, makeMoveDto.player === PlayerEnum.Player1 ? FieldStateEnum.FilledByPlayer1 : FieldStateEnum.FilledByPlayer2);

        // Speichere den Zug
        const move = this.moveRepository.create({
            game,
            player: makeMoveDto.player,
            x: makeMoveDto.x,
            y: makeMoveDto.y,
        });
        await this.moveRepository.save(move);

        // Wechsle den Spieler für den nächsten Zug
        game.currentTurn = makeMoveDto.player === PlayerEnum.Player1 ? PlayerEnum.Player2 : PlayerEnum.Player1;

        // Hier könnte man den Spielstatus überprüfen (Gewonnen, Unentschieden, usw.)

        return this.gameRepository.save(game);
    }

    async getGame(gameId: number): Promise<Game> {
        return await this.gameRepository.findOneBy({gameId});
    }

    // Weitere Methoden wie ELO-Berechnung, Spiel beenden etc.
    calculateElo(player: User, opponent: User, result: number): number {
        const k = 20;
        const expectedScore = 1 / (1 + Math.pow(10, (opponent.elo - player.elo) / 400));
        const newElo = player.elo + k * (result - expectedScore);
        return Math.round(newElo);
    }
}