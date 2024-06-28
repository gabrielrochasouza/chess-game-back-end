import { Module } from '@nestjs/common';
import { ChessGamesService } from './chess_games.service';
import { ChessGamesController } from './chess_games.controller';

@Module({
    controllers: [ChessGamesController],
    providers: [ChessGamesService],
})
export class ChessGamesModule {}
