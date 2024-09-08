import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from '../../services/game/game.service';

@WebSocketGateway()
export class GameGateway {
  @WebSocketServer()
  server: Server;

  constructor(private gameService: GameService) {}

  @SubscribeMessage('move')
  async onMoveMade(client: Socket, payload: { gameId: number, move: { x: number, y: number }, playerId: number }) {
    try {
      await this.gameService.makeMove(payload.gameId, payload.playerId, payload.move);
      const game = await this.gameService.getGameById(payload.gameId);
      this.server.to(payload.gameId.toString()).emit('gameState', game);
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('resign')
  async onResign(client: Socket, payload: { gameId: number, playerId: number }) {
    try {
      await this.gameService.resignGame(payload.gameId, payload.playerId);
      const game = await this.gameService.getGameById(payload.gameId);
      this.server.to(payload.gameId.toString()).emit('gameEnded', game);
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }
}
