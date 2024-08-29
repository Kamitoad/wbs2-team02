import {SubscribeMessage, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import {Server, Socket} from "socket.io";

@WebSocketGateway({namespace: 'ws-user-queue'})
export class QueueGateway {

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('joinQueue')
  handleJoinQueue(client: Socket, payload: { userId: number }): void {
    console.log(`User ${payload.userId} trat der Queue bei`);
  }

  sendQueueTime(userId: number, time: Promise<number>): void {
    this.server.emit('queueTimeUpdate', { userId, time });
  }
}
