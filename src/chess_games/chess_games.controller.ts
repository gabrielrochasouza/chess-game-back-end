import { Controller, Post, Body, Headers, UseGuards, Param, Patch, Get } from '@nestjs/common';
import { ChessGamesService } from './chess_games.service';
import { CreateChessGameDto } from './dto/create-chess_game.dto';
import { ChessGamesAuthGuard } from 'src/auth_guard/chess-games-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Chess Game')
@Controller('chess-games')
export class ChessGamesController {
    constructor(private readonly chessGamesService: ChessGamesService) {}

    @Get(':id')
    @UseGuards(ChessGamesAuthGuard)
    getChessGame(@Param('id') chessGameId: string) {
        return this.chessGamesService.getChessGame(chessGameId);
    }

    @Post()
    @UseGuards(ChessGamesAuthGuard)
    create(@Body() createChessGameDto: CreateChessGameDto, @Headers() headers: Record<string, string>) {
        return this.chessGamesService.createChessGame(createChessGameDto, headers['authorization']);
    }

    @Patch('start-game/:id')
    @UseGuards(ChessGamesAuthGuard)
    startGame(@Param('id') chessGameId: string, @Headers() headers: Record<string, string>) {
        return this.chessGamesService.setChessPlayerColor(chessGameId, headers['authorization']);
    }

    @UseGuards(ChessGamesAuthGuard)
    @Patch('make-match-request/:id')
    makeMatchRequest(@Param('id') chessGameId: string, @Headers() headers: Record<string, string>) {
        return this.chessGamesService.makeMatchRequest(chessGameId, headers['authorization']);
    }

}
