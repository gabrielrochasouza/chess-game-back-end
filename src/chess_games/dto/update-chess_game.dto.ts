import { PartialType } from '@nestjs/mapped-types';
import { CreateChessGameDto } from './create-chess_game.dto';
import { IsBoolean, IsString } from 'class-validator';

export class UpdateChessGameDto extends PartialType(CreateChessGameDto) {
    @IsString()
        winner: string;
    @IsString()
        loser: string;
    @IsBoolean()
        draw: boolean;
}
