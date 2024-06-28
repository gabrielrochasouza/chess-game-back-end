import { Injectable } from '@nestjs/common';
import { CreateChessGameDto } from './dto/create-chess_game.dto';
import { UpdateChessGameDto } from './dto/update-chess_game.dto';

@Injectable()
export class ChessGamesService {
    create(createChessGameDto: CreateChessGameDto) {
        console.log(createChessGameDto);
        return 'This action adds a new chessGame';
    }

    findAll() {
        return `This action returns all chessGames`;
    }

    findOne(id: number) {
        return `This action returns a #${id} chessGame`;
    }

    update(id: number, updateChessGameDto: UpdateChessGameDto) {
        console.log(updateChessGameDto)
        return `This action updates a #${id} chessGame`;
    }

    remove(id: number) {
        return `This action removes a #${id} chessGame`;
    }
}
