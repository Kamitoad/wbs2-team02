import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from '../../services/game/game.service';

@WebSocketGateway()
export class GameGateway {
  @WebSocketServer()
  server: Server;

  constructor(private gameService: GameService) {}

  @SubscribeMessage('move')
  async handleMove(client: Socket, payload: { gameId: number, row: number, col: number, player: string }) {
    // Process the move and send it to the other players
    const game = await this.gameService.getGameState(payload.gameId);
    if (game && !game.hasEnded) {
      // Logic to save the move
      await this.gameService.makeMove(game.gameId, payload.row, payload.col, payload.player);
      this.server.emit('move', payload);
      // Check if the game is over and notify the players
      if (await this.gameService.isGameEnded(game.gameId)) {
        this.server.emit('gameEnded', { winner: game.winner });
      }
    }
  }
}
