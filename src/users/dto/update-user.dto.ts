import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsBoolean, IsNumber, IsString, MinLength } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsString()
        username: string;
    @IsString()
    @MinLength(8)
        password: string;
    @IsBoolean()
        active?: boolean;
    @IsNumber()
        wins: number;
    @IsNumber()
        loses: number;
    @IsNumber()
        draws: number;
}
