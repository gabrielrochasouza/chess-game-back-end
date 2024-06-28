import { IsString, IsBoolean } from 'class-validator';

export class CreateChessGameDto {
    @IsString()
        blackPieceUsername: string;
    @IsString()
        whitePieceUsername: string;
    @IsString()
        winner: string;
    @IsString()
        loser: string;
    @IsBoolean()
        draw: boolean;
}

