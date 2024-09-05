import {ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import {Server, Socket} from "socket.io";
import {QueueService} from "../../services/queue/queue.service";
import {Injectable} from "@nestjs/common";

@WebSocketGateway({ namespace: 'ws-user-queue' })

@Injectable()
export class QueueGateway {
  @WebSocketServer()
  server: Server;

  //Users connected to this socket
  private connectedUsers: Map<number, Socket> = new Map(); // Mappe von UserId zu Socket

  constructor(private queueService: QueueService) {}

  @SubscribeMessage('joinQueue')
  async handleJoinQueue(
      @ConnectedSocket() client: Socket,
      @MessageBody() payload: { userId: number },
  ): Promise<void> {
    console.log(`User ${payload.userId} joined the queue.`);

    // Save User using this Socket in Socket-Map
    this.connectedUsers.set(payload.userId, client);

    try {
      // Search for opponent
      const { opponent, currentUser, gameId } = await this.queueService.join(payload.userId);

      client.emit('join-queue-success');

      // If opponent found, make a game, else stop
      if (opponent) {
        const opponentSocket = this.connectedUsers.get(opponent.userId);

        // Send data of opponent to current user
        // (current user is the last one who joined the queue of the two players)
        setTimeout(() => {
          if (client) {
            client.emit('opponent-data', {
              userName: opponent.userName,
              elo: opponent.elo,
              profilePic: opponent.profilePic,
              gameId: gameId,
            });
          }

          // Send data of current user to opponent
          // (opponent is the first one who joined the queue of the two players)
          if (opponentSocket) {
            opponentSocket.emit('opponent-data', {
              userName: currentUser.userName,
              elo: currentUser.elo,
              profilePic: currentUser.profilePic,
              gameId: gameId,
            });
          }
        },1000)

      }
    } catch (error) {
      client.emit('queue-error', { message: error.message });
    }
  }
}
