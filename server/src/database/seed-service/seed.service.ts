import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../User';
import { Game } from '../Game';
import {RoleEnum} from "../enums/RoleEnum";
import * as bcrypt from 'bcryptjs';

@Injectable()
export class SeedService {

    constructor(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        @InjectRepository(User) private userRepository: Repository<User>,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        @InjectRepository(Game) private gameRepository: Repository<Game>,
    ) {}

    async seed() {
        const userCount = await this.userRepository.count();

        // Überprüfen, ob bereits Nutzer in der Datenbank existieren
        if (userCount === 0) {
            // Demodaten erstellen
            const user1: User = this.userRepository.create();
            user1.userName = 'MaxUserman';
            user1.email = 'max@mustermann.de';
            user1.password = await bcrypt.hash('123123123', 10);
            user1.firstName = 'Max';
            user1.lastName = 'Mustermann';
            user1.role = RoleEnum.Admin;
            user1.elo = 1300;
            user1.profilePic = "maxPb.jpeg";
            user1.inQueue = false;
            user1.totalWins = 20;
            user1.totalTies = 5;
            user1.totalLosses = 10;
            await this.userRepository.save(user1);

            const user2: User = this.userRepository.create();
            user2.userName = 'Kamitoad';
            user2.email = 'kami@toad.de';
            user2.password = await bcrypt.hash('sicher', 10);
            user2.firstName = 'Chasan';
            user2.lastName = 'Moustafa';
            user2.role = RoleEnum.User;
            user2.elo = 1100;
            user2.profilePic = "kamiPb.jpg";
            user2.inQueue = false;
            user2.totalWins = 30;
            user2.totalTies = 10;
            user2.totalLosses = 15;
            await this.userRepository.save(user2);

            const user3: User = this.userRepository.create();
            user3.userName = 'Palidii';
            user3.email = 'dim@pal.com';
            user3.password = await bcrypt.hash('passwort', 10);
            user3.firstName = 'Dimitrios';
            user3.lastName = 'Paliouras';
            user3.role = RoleEnum.User;
            user3.elo = 1150;
            user3.profilePic = "dimiPb.jpeg";
            user3.inQueue = false;
            user3.totalWins = 30;
            user3.totalTies = 10;
            user3.totalLosses = 15;
            await this.userRepository.save(user3);

            const user4: User = this.userRepository.create();
            user4.userName = 'NilDie';
            user4.email = 'nil@die.de';
            user4.password = await bcrypt.hash('qwertz', 10);
            user4.firstName = 'Nils';
            user4.lastName = 'Dietzler';
            user4.role = RoleEnum.User;
            user4.elo = 1150;
            user4.profilePic = "nilsPb.jpg";
            user4.inQueue = false;
            user4.totalWins = 30;
            user4.totalTies = 10;
            user4.totalLosses = 15;
            await this.userRepository.save(user4);

            const user5: User = this.userRepository.create();
            user5.userName = 'FabFim';
            user5.email = 'fab@fim.de';
            user5.password = await bcrypt.hash('asdfgh', 10);
            user5.firstName = 'Fabian';
            user5.lastName = 'Fimmen';
            user5.role = RoleEnum.User;
            user5.elo = 1100;
            user5.profilePic = "fabiPb.png";
            user5.inQueue = false;
            user5.totalWins = 30;
            user5.totalTies = 10;
            user5.totalLosses = 15;
            await this.userRepository.save(user5);

            const user6: User = this.userRepository.create();
            user6.userName = 'AleLor';
            user6.email = 'ale@lor.de';
            user6.password = await bcrypt.hash('yxcvbn', 10);
            user6.firstName = 'Alexandra';
            user6.lastName = 'Lorenz';
            user6.role = RoleEnum.User;
            user6.elo = 1150;
            user6.profilePic = "alexPb.jpg";
            user6.inQueue = false;
            user6.totalWins = 30;
            user6.totalTies = 10;
            user6.totalLosses = 15;
            await this.userRepository.save(user6);

            console.log('Demo-Daten wurden eingefügt');
        }

        const gameCount = await this.gameRepository.count();

        // Überprüfen, ob bereits Nutzer in der Datenbank existieren
        if (gameCount === 0) {
            const game1: Game = this.gameRepository.create();
            game1.hasEnded = true;
            game1.field0_0 = 1;
            game1.field0_1 = 1;
            game1.field0_2 = 1;
            game1.field1_0 = 2;
            game1.field1_1 = 2;
            game1.field1_2 = 0;
            game1.field2_0 = 0;
            game1.field2_1 = 0;
            game1.field2_2 = 0;
            game1.winner = 1;
            game1.loser = 2;
            game1.isTie = false;
            game1.changeEloPlayer1 = 10;
            game1.changeEloPlayer2 = -10;
            game1.currentPlayer = 2;

            let player1 = await this.userRepository.findOne({ where: { userId: 1 } });
            let player2 = await this.userRepository.findOne({ where: { userId: 2 } });

            game1.player1 = player1;
            game1.player2 = player2;

            await this.gameRepository.save(game1);

            const game2: Game = this.gameRepository.create();
            game2.hasEnded = true;
            game2.field0_0 = 2;
            game2.field0_1 = 1;
            game2.field0_2 = 2;
            game2.field1_0 = 1;
            game2.field1_1 = 2;
            game2.field1_2 = 1;
            game2.field2_0 = 1;
            game2.field2_1 = 2;
            game2.field2_2 = 1;
            game2.winner = 3;
            game2.loser = 2;
            game2.isTie = true;
            game2.changeEloPlayer1 = 20;
            game2.changeEloPlayer2 = -20;
            game2.currentPlayer = 3;

            player1 = await this.userRepository.findOne({ where: { userId: 3 } });
            player2 = await this.userRepository.findOne({ where: { userId: 2 } });

            game2.player1 = player1;
            game2.player2 = player2;

            await this.gameRepository.save(game2);


            const game3: Game = this.gameRepository.create();
            game3.hasEnded = true;
            game3.field0_0 = 2;
            game3.field0_1 = 0;
            game3.field0_2 = 1;
            game3.field1_0 = 2;
            game3.field1_1 = 0;
            game3.field1_2 = 1;
            game3.field2_0 = 0;
            game3.field2_1 = 0;
            game3.field2_2 = 1;
            game3.winner = 4;
            game3.loser = 5;
            game3.isTie = false;
            game3.changeEloPlayer1 = 15;
            game3.changeEloPlayer2 = -15;
            game3.currentPlayer = 4;

            player1 = await this.userRepository.findOne({ where: { userId: 4 } });
            player2 = await this.userRepository.findOne({ where: { userId: 5 } });

            game3.player1 = player1;
            game3.player2 = player2;

            await this.gameRepository.save(game3);


            const game4: Game = this.gameRepository.create();
            game4.hasEnded = true;
            game4.field0_0 = 1;
            game4.field0_1 = 0;
            game4.field0_2 = 2;
            game4.field1_0 = 0;
            game4.field1_1 = 1;
            game4.field1_2 = 2;
            game4.field2_0 = 0;
            game4.field2_1 = 0;
            game4.field2_2 = 1;
            game4.winner = 5;
            game4.loser = 6;
            game4.isTie = false;
            game4.changeEloPlayer1 = -10;
            game4.changeEloPlayer2 = 10;
            game4.currentPlayer = 5;

            player1 = await this.userRepository.findOne({ where: { userId: 6 } });
            player2 = await this.userRepository.findOne({ where: { userId: 5 } });

            game4.player1 = player1;
            game4.player2 = player2;

            await this.gameRepository.save(game4);


            const game5: Game = this.gameRepository.create();
            game5.hasEnded = true;
            game5.field0_0 = 2;
            game5.field0_1 = 2;
            game5.field0_2 = 2;
            game5.field1_0 = 0;
            game5.field1_1 = 0;
            game5.field1_2 = 0;
            game5.field2_0 = 1;
            game5.field2_1 = 1;
            game5.field2_2 = 0;
            game5.winner = 5;
            game5.loser = 1;
            game5.isTie = false;
            game5.changeEloPlayer1 = -50;
            game5.changeEloPlayer2 = 50;
            game5.currentPlayer = 5;

            player1 = await this.userRepository.findOne({ where: { userId: 1 } });
            player2 = await this.userRepository.findOne({ where: { userId: 5 } });

            game5.player1 = player1;
            game5.player2 = player2;

            await this.gameRepository.save(game5);


            const game6: Game = this.gameRepository.create();
            game6.hasEnded = true;
            game6.field0_0 = 1;
            game6.field0_1 = 2;
            game6.field0_2 = 0;
            game6.field1_0 = 1;
            game6.field1_1 = 2;
            game6.field1_2 = 0;
            game6.field2_0 = 1;
            game6.field2_1 = 2;
            game6.field2_2 = 0;
            game6.winner = 4;
            game6.loser = 2;
            game6.isTie = false;
            game6.changeEloPlayer1 = -5;
            game6.changeEloPlayer2 = 5;
            game6.currentPlayer = 4;

            player1 = await this.userRepository.findOne({ where: { userId: 2 } });
            player2 = await this.userRepository.findOne({ where: { userId: 4 } });

            game6.player1 = player1;
            game6.player2 = player2;

            await this.gameRepository.save(game6);


            const game7: Game = this.gameRepository.create();
            game7.hasEnded = true;
            game7.field0_0 = 0;
            game7.field0_1 = 0;
            game7.field0_2 = 2;
            game7.field1_0 = 2;
            game7.field1_1 = 0;
            game7.field1_2 = 0;
            game7.field2_0 = 1;
            game7.field2_1 = 1;
            game7.field2_2 = 1;
            game7.winner = 1;
            game7.loser = 2;
            game7.isTie = false;
            game7.changeEloPlayer1 = 10;
            game7.changeEloPlayer2 = -10;
            game7.currentPlayer = 1;

            player1 = await this.userRepository.findOne({ where: { userId: 1 } });
            player2 = await this.userRepository.findOne({ where: { userId: 2 } });

            game7.player1 = player1;
            game7.player2 = player2;

            await this.gameRepository.save(game7);


            const game8: Game = this.gameRepository.create();
            game8.hasEnded = true;
            game8.field0_0 = 1;
            game8.field0_1 = 0;
            game8.field0_2 = 0;
            game8.field1_0 = 1;
            game8.field1_1 = 2;
            game8.field1_2 = 0;
            game8.field2_0 = 1;
            game8.field2_1 = 2;
            game8.field2_2 = 0;
            game8.winner = 6;
            game8.loser = 3;
            game8.isTie = false;
            game8.changeEloPlayer1 = 10;
            game8.changeEloPlayer2 = -10;
            game8.currentPlayer = 3;

            player1 = await this.userRepository.findOne({ where: { userId: 6 } });
            player2 = await this.userRepository.findOne({ where: { userId: 3 } });

            game8.player1 = player1;
            game8.player2 = player2;

            await this.gameRepository.save(game8);


            const game9: Game = this.gameRepository.create();
            game9.hasEnded = true;
            game9.field0_0 = 1;
            game9.field0_1 = 2;
            game9.field0_2 = 1;
            game9.field1_0 = 2;
            game9.field1_1 = 2;
            game9.field1_2 = 1;
            game9.field2_0 = 1;
            game9.field2_1 = 1;
            game9.field2_2 = 2;
            game9.winner = null;
            game9.loser = null;
            game9.isTie = false;
            game9.changeEloPlayer1 = -1;
            game9.changeEloPlayer2 = 1;
            game9.currentPlayer = 2;

            player1 = await this.userRepository.findOne({ where: { userId: 2 } });
            player2 = await this.userRepository.findOne({ where: { userId: 5 } });

            game9.player1 = player1;
            game9.player2 = player2;

            await this.gameRepository.save(game9);


            const game10: Game = this.gameRepository.create();
            game10.hasEnded = true;
            game10.field0_0 = 0;
            game10.field0_1 = 0;
            game10.field0_2 = 1;
            game10.field1_0 = 2;
            game10.field1_1 = 1;
            game10.field1_2 = 2;
            game10.field2_0 = 1;
            game10.field2_1 = 0;
            game10.field2_2 = 0;
            game10.winner = 4;
            game10.loser = 5;
            game10.isTie = false;
            game10.changeEloPlayer1 = 20;
            game10.changeEloPlayer2 = -20;
            game10.currentPlayer = 4;

            player1 = await this.userRepository.findOne({ where: { userId: 4 } });
            player2 = await this.userRepository.findOne({ where: { userId: 5 } });

            game10.player1 = player1;
            game10.player2 = player2;

            await this.gameRepository.save(game10);
        }
    }
}
