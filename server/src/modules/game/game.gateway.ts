import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { GameService } from './game.service';

@WebSocketGateway()
export class GameGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly gameService: GameService) {}

  @SubscribeMessage('joinGame')
  async handleJoinGame(@MessageBody() data: { playerId: number }) {
    // Hier kannst du die Logik für das Matchmaking implementieren.
    // Beispiel: Einen Spieler in eine Warteschlange einfügen oder sofort mit einem anderen Spieler verbinden.
    console.log('Player joined game:', data.playerId);
    // GameService könnte hier verwendet werden, um den Spieler zu registrieren oder eine neue Partie zu erstellen.
  }

  @SubscribeMessage('makeMove')
  async handleMakeMove(@MessageBody() data: { gameId: number; move: any }) {
    // Hier könnte die Logik für einen Zug im Spiel implementiert werden.
    console.log('Move made in game:', data.gameId, 'with move:', data.move);
    // GameService könnte hier verwendet werden, um den Zug zu validieren und das Spiel zu aktualisieren.
  }

  // Weitere Nachrichten-Handler können hier hinzugefügt werden, z.B. für das Verlassen eines Spiels oder das Anzeigen des Spielstatus.
}
