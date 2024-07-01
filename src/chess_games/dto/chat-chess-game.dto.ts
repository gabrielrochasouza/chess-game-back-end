import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class ChatChessGameDto {
    @ApiProperty({
        description: 'The Chat data of the room'
    })
    @IsString()
    @IsNotEmpty()
        chat: string;
}