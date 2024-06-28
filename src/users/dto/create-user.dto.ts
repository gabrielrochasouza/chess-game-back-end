import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({
        description: 'The username field, it has a unique constraint.'
    })
    @IsString()
    @IsNotEmpty()
        username: string;

    @ApiProperty({
        description: 'The password field, has a minimum of 8 characters.'
    })
    @IsString()
    @MinLength(8)
    @IsNotEmpty()
        password: string;
}
