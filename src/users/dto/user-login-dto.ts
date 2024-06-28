import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export default class UserLoginDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
        username: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
        password: string;

}