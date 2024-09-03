import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import{User} from "../../../database/User";
import{Game} from "../../../database/Game";

@Injectable()
export class EloService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Game)
        private gameRepository: Repository<Game>,
    ) {}

    // Spieler anhand ihrer IDs finden
    findUserById(id: number): Promise<User> {
        return this.userRepository.findOne({ where: { userId: id } });
    }

    // Spiel anhand seiner ID finden
    findGameById(gameId: number): Promise<Game> {
        return this.gameRepository.findOne({ where: { gameId } });
    }

    // Spieler-Elo aktualisieren
    async updateUserElo(id: number, newElo: number): Promise<User> {
        const player = await this.findUserById(id);
        if (player) {
            player.elo = newElo;
            return this.userRepository.save(player);
        }
        throw new Error('User nicht gefunden');
    }

    // Neue Elo-Wertung berechnen
    async calculateNewElo(user1Id: number, user2Id: number, gameId: number): Promise<void> {
        const user1 = await this.findUserById(user1Id);
        const user2 = await this.findUserById(user2Id);
        const game = await this.findGameById(gameId);

        if (!user1 || !user2) {
            throw new Error('Ein oder beide Spieler nicht gefunden');
        }
        if (!game) {
            throw new Error('Spiel nicht gefunden');
        }

        const K = 20; //Anpassungsfaktor

        //Erwartungswert E  = 1/(1+10^(Rg-R)/400)
        const expectedUser1 = 1 / (1 + 10 ** ((user2.elo - user1.elo) / 400));
        const espectedUser2 = 1 - expectedUser1;

        //Parteipunktzahl S:
        // 1 -> Partie gewonnen
        // 0 -> Partie verloren
        // 0,5 -> Unentschieden --> noch kein tied in game db

        const actualScoreUser1 = game.winner === user1Id ? 1 : 0;
        const actualScoreUser2 = game.winner === user2Id ? 1 : 0;

        // Berechnung neuer Elo
        // Formel:      R'= R+ k * (S - E)
        const newEloUser1 = user1.elo + K * (actualScoreUser1 - expectedUser1);
        const newEloUser2 = user2.elo + K * (actualScoreUser2 - espectedUser2);

        // Aktualisieren der Elo-Werte
        await this.updateUserElo(user1.userId, newEloUser1);
        await this.updateUserElo(user2.userId, newEloUser2);

        // Spiel-Elo-Änderungen speichern
        game.changeEloPlayer1 = Math.round(newEloUser1 - user1.elo);
        game.changeEloPlayer2 = Math.round(newEloUser2 - user2.elo);
        await this.gameRepository.save(game);
    }
}
