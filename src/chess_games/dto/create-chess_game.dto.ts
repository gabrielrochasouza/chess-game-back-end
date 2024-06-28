import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateChessGameDto {
    @ApiProperty({
        description: 'The User Identification to create a new chess game'
    })
    @IsString()
    @IsNotEmpty()
        userId: string;

}

