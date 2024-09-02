import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service'; // Importiere GameService

@WebSocketGateway()
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly gameService: GameService) {}

  afterInit() {
    console.log('WebSocket server initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('createGame')
  async handleCreateGame(client: Socket, payload: { player1Id: number; player2Id: number }) {
    try {
      const game = await this.gameService.createGame(payload.player1Id, payload.player2Id);
      this.server.emit('gameCreated', game);
    } catch (error) {
      console.error('Error creating game:', error);
    }
  }

  @SubscribeMessage('makeMove')
  async handleMakeMove(client: Socket, payload: { gameId: number; move: { field: string; value: number } }) {
    try {
      const updatedGame = await this.gameService.makeMove(payload.gameId, payload.move); // Achte darauf, dass die Methode korrekt heißt
      this.server.emit('gameUpdated', updatedGame);
    } catch (error) {
      console.error('Error making move:', error);
    }
  }
}
