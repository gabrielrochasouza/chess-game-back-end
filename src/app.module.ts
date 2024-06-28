import { Module } from "@nestjs/common";
import { ChatGateway } from "./websockets/chat.gateway";
import { ChatService } from "./websockets/chat.service";
import { UsersModule } from './users/users.module';
import { ChessGamesModule } from './chess_games/chess_games.module';

@Module({
    imports: [UsersModule, ChessGamesModule],
    controllers: [],
    providers: [ChatGateway, ChatService],
})

export class AppModule {}
