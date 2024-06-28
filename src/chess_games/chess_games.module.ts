import { Module } from '@nestjs/common';
import { ChessGamesService } from './chess_games.service';
import { ChessGamesController } from './chess_games.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChessGamesAuthGuard } from 'src/auth_guard/chess-games-auth.guard';

@Module({
    controllers: [ChessGamesController],
    providers: [ChessGamesService, PrismaService, ChessGamesAuthGuard],
})
export class ChessGamesModule {}
