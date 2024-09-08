export class MakeMoveDto {
    gameId: number;
    playerId: number;
    move: {
        x: number;
        y: number;
    };
}
