import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { GameService } from '../../services/game/game.service';

@WebSocketGateway()
export class GameGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly gameService: GameService) {}

  // Handle when a player makes a move
  @SubscribeMessage('makeMove')
  async handleMove(
      @MessageBody() moveData: { gameId: number; userId: number; move: { x: number, y: number } },
      @ConnectedSocket() client: Socket,
  ) {
    try {
      // Call the makeMove method from game.service
      await this.gameService.makeMove(moveData.gameId, moveData.userId, moveData.move);

      // Fetch the updated game state
      const game = await this.gameService.getGameById(moveData.gameId);

      // Emit the updated game state to all players in the game room
      this.server.to(`game_${moveData.gameId}`).emit('gameState', game);
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }

  // Handle when a player joins a game room
  @SubscribeMessage('joinGame')
  handleJoinGame(
      @MessageBody() data: { gameId: number; userId: number },
      @ConnectedSocket() client: Socket,
  ) {
    client.join(`game_${data.gameId}`);
    client.emit('joinedGame', { gameId: data.gameId });
  }

  // Handle when a player resigns
  @SubscribeMessage('resign')
  async onResign(
      @MessageBody() payload: { gameId: number; playerId: number },
      @ConnectedSocket() client: Socket,
  ) {
    try {
      await this.gameService.resignGame(payload.gameId, payload.playerId);

      // Get the updated game state
      const game = await this.gameService.getGameById(payload.gameId);

      // Notify all players that the game has ended
      this.server.to(`game_${payload.gameId}`).emit('gameEnded', game);
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }
}