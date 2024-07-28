import { IsNotEmpty, IsString } from "class-validator";

export class CreateNotificationDto {
    @IsString()
    @IsNotEmpty()
        targetUserId: string;

    @IsString()
    @IsNotEmpty()
        message: string;

    @IsString()
    @IsNotEmpty()
        roomId: string;

    @IsString()
    @IsNotEmpty()
        username: string;
}
