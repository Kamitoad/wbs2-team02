import {SubscribeMessage, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import {Server, Socket} from "socket.io";

@WebSocketGateway()
export class QueueGateway {

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('joinQueue')
  handleJoinQueue(client: Socket, payload: { userId: number }): void {
    console.log(`User ${payload.userId} trat der Queue bei`);
  }

  sendQueueTime(userId: number, time: number): void {
    this.server.emit('queueTimeUpdate', { userId, time });
  }
}
