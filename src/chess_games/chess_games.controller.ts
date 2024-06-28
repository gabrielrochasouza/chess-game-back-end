import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChessGamesService } from './chess_games.service';
import { CreateChessGameDto } from './dto/create-chess_game.dto';
import { UpdateChessGameDto } from './dto/update-chess_game.dto';

@Controller('chess-games')
export class ChessGamesController {
    constructor(private readonly chessGamesService: ChessGamesService) {}

  @Post()
    create(@Body() createChessGameDto: CreateChessGameDto) {
        return this.chessGamesService.create(createChessGameDto);
    }

  @Get()
  findAll() {
      return this.chessGamesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
      return this.chessGamesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChessGameDto: UpdateChessGameDto) {
      return this.chessGamesService.update(+id, updateChessGameDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
      return this.chessGamesService.remove(+id);
  }
}
