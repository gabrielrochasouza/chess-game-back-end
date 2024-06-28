import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsBoolean, IsOptional, IsString, IsUrl, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiProperty({
        description: 'The username field, it has a unique constraint.'
    })
    @IsOptional()
    @IsString()
        username?: string;

    @ApiProperty({
        description: 'The password field, has a minimum of 8 characters.'
    })
    @IsString()
    @MinLength(8)
    @IsOptional()
        password?: string;

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
        active?: boolean;

    @ApiProperty({
        description: 'It is a url for a profile picture.'
    })
    @IsString()
    @IsOptional()
    @IsUrl()
        profilePic?: string;

}
