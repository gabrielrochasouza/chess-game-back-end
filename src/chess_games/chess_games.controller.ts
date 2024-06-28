import { Controller, Post, Body, Headers, UseGuards, Param, Patch } from '@nestjs/common';
import { ChessGamesService } from './chess_games.service';
import { CreateChessGameDto } from './dto/create-chess_game.dto';
import { ChessGamesAuthGuard } from 'src/auth_guard/chess-games-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Chess Game')
@Controller('chess-games')
export class ChessGamesController {
    constructor(private readonly chessGamesService: ChessGamesService) {}

    @Post()
    @UseGuards(ChessGamesAuthGuard)
    create(@Body() createChessGameDto: CreateChessGameDto, @Headers() headers: Record<string, string>) {
        return this.chessGamesService.getChessGame(createChessGameDto, headers['authorization']);
    }

    @Patch('start-game/:id')
    @UseGuards(ChessGamesAuthGuard)
    startGame(@Param('id') chessGameId: string) {
        return this.chessGamesService.setChessPlayerColor(chessGameId);
    }

}
