import { Controller, Post, Body, Headers, UseGuards, Param, Patch, Get } from '@nestjs/common';
import { ChessGamesService } from './chess_games.service';
import { CreateChessGameDto } from './dto/create-chess_game.dto';
import { ChessGamesAuthGuard } from 'src/auth_guard/chess-games-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { ChatChessGameDto } from './dto/chat-chess-game.dto';

@ApiTags('Chess Game')
@Controller('chess-games')
export class ChessGamesController {
    constructor(private readonly chessGamesService: ChessGamesService) {}

    @Get(':chessGameId')
    @UseGuards(ChessGamesAuthGuard)
    getChessGame(@Param('chessGameId') chessGameId: string) {
        return this.chessGamesService.getChessGame(chessGameId);
    }

    @Post()
    @UseGuards(ChessGamesAuthGuard)
    create(@Body() createChessGameDto: CreateChessGameDto, @Headers() headers: Record<string, string>) {
        return this.chessGamesService.createChessGame(createChessGameDto, headers['authorization']);
    }

    @Patch('start-game/:chessGameId')
    @UseGuards(ChessGamesAuthGuard)
    startGame(@Param('chessGameId') chessGameId: string, @Headers() headers: Record<string, string>) {
        return this.chessGamesService.startChessGame(chessGameId, headers['authorization']);
    }

    @UseGuards(ChessGamesAuthGuard)
    @Patch('make-match-request/:chessGameId')
    makeMatchRequest(@Param('chessGameId') chessGameId: string, @Headers() headers: Record<string, string>) {
        return this.chessGamesService.makeMatchRequest(chessGameId, headers['authorization']);
    }

    @UseGuards(ChessGamesAuthGuard)
    @Patch('finish-game/:chessGameId')
    finishGame (@Param('chessGameId') chessGameId: string, @Headers() headers: Record<string, string>) {
        return this.chessGamesService.finishGame(chessGameId, headers['authorization']);
    }

    @Patch('save-chat/:chessGameId')
    @UseGuards(ChessGamesAuthGuard)
    saveChat(@Param('chessGameId') chessGameId: string, @Body() chatChessGameDto: ChatChessGameDto, @Headers() headers: Record<string, string>) {
        return this.chessGamesService.saveChat(chessGameId, chatChessGameDto, headers['authorization']);
    }

}
