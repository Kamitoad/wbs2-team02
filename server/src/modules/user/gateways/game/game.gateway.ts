import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from '../../services/game/game.service';

@WebSocketGateway()
export class GameGateway {
  @WebSocketServer()
  server: Server;

  constructor(private gameService: GameService) {}

  @SubscribeMessage('move')
  async onMoveMade(client: Socket, payload: { gameId: number, x: number, y: number, playerId: number }) {
    await this.gameService.makeMove(payload.gameId, payload.playerId, { x: payload.x, y: payload.y });
    this.server.to(payload.gameId.toString()).emit('moveMade', { x: payload.x, y: payload.y, playerId: payload.playerId });
  }

  // Benachrichtigt beide Spieler, dass das Spiel beendet ist und gibt den Gewinner bekannt.
  // async onGameEnded(gameId: number, winnerId: number, loserId: number) {}

  // Falls ein Spieler aufgibt, wird dieses Event gesendet und der Gegner als Sieger gekennzeichnet.
  // async onResign(gameId: number, playerId: number) {}
}
