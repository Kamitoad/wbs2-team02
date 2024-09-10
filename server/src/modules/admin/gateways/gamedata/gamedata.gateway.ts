import {WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import {Server} from "socket.io";
import {ReadQueueForAdminDto} from "../../dtos/ReadQueueForAdminDto";
import {ReadCurrentGamesDto} from "../../dtos/ReadCurrentGamesDto";

@WebSocketGateway({namespace: 'ws-admin-gamedata'} )
export class GamedataGateway {

  @WebSocketServer()
  server: Server;

  //WebSocket for current games
  notifyGameAdded(newGame: any) {
    this.server.emit('game-added', new ReadCurrentGamesDto(newGame));
  }

  notifyGameEnded(gameId: number) {
    this.server.emit('game-ended', gameId);
  }

  //WebSocket for matchmaking queue
  async handleJoinQueue(user: any): Promise<void> {
    this.server.emit('queue-user-added', new ReadQueueForAdminDto(user));
  }

  async handleLeaveQueue(userId: number): Promise<void> {
    this.server.emit('queue-user-removed', userId);
  }
}
