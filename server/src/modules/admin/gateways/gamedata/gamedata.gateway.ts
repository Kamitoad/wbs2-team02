import {WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import {Server} from "socket.io";

@WebSocketGateway({namespace: 'ws-admin-gamedata'} )
export class GamedataGateway {

  @WebSocketServer()
  server: Server;

  notifyGameAdded(newGame: any) {
    this.server.emit('game-added', newGame);
  }

  notifyGameEnded(gameId: number) {
    this.server.emit('game-ended', { gameId });
  }
}
