import { IsString, IsNotEmpty } from "class-validator";

export default class UserLoginDto {
    @IsString()
    @IsNotEmpty()
        username: string;
    @IsString()
    @IsNotEmpty()
        password: string;
}