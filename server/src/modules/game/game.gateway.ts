import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { GameService } from './game.service';

@WebSocketGateway({ cors: true })
export class GameGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly gameService: GameService) {}

  @SubscribeMessage('joinGame')
  async handleJoinGame(@MessageBody() data: { playerId: number }) {
    try {
      const game = await this.gameService.createOrFindGame(data.playerId);
      this.server.emit('gameAssigned', game);
    } catch (error) {
      this.server.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('makeMove')
  async handleMakeMove(@MessageBody() data: { gameId: number; move: any }) {
    try {
      const updatedGame = await this.gameService.processPlayerMove(data.gameId, data.move);
      this.server.emit('gameUpdated', updatedGame);
    } catch (error) {
      this.server.emit('error', { message: error.message });
    }
  }
}
