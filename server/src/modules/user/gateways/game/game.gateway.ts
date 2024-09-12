import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    WebSocketServer,
    ConnectedSocket,
} from '@nestjs/websockets';
import {Server, Socket} from 'socket.io';
import {GameService} from '../../services/game/game.service';
import {Logger} from '@nestjs/common';

@WebSocketGateway({namespace: 'ws-user-game'})
export class GameGateway {
    @WebSocketServer() server: Server;
    private readonly logger = new Logger(GameGateway.name);

    constructor(private readonly gameService: GameService) {
    }  // Füge den GameService über den Konstruktor hinzu

    @SubscribeMessage('move')
    async handleMove(
        @MessageBody() moveData: { gameId: number; userId: number; move: { x: number, y: number } },
        @ConnectedSocket() client: Socket,
    ) {
        this.logger.log(`Player ${moveData.userId} made a move in game ${moveData.gameId}`);
        try {
            await this.gameService.makeMove(moveData.gameId, moveData.userId, moveData.move);
            const game = await this.gameService.getGameById(moveData.gameId);
            this.server.to(`game_${moveData.gameId}`).emit('gameState', game);
        } catch (error) {
            this.logger.error(`Error handling move: ${error.message}`);
            client.emit('error', {message: error.message});
        }
    }

    notifyWinner(gameId: number, winner: string) {
        this.logger.log(`Player ${winner} won game ${gameId}`);
        this.server.emit('winner', {gameId, winner});
    }

    @SubscribeMessage('joinGame')
    handleJoinGame(
        @MessageBody() data: { gameId: number; userId: number },
        @ConnectedSocket() client: Socket,
    ) {
        client.join(`game_${data.gameId}`);
        client.emit('joinedGame', {gameId: data.gameId});
        this.logger.log(`Player ${data.userId} joined game ${data.gameId}`);
    }

}
