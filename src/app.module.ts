import { Module } from "@nestjs/common";
import { ChatGateway } from "./websockets/chat.gateway";
import { ChatService } from "./websockets/chat.service";
import { UsersModule } from './users/users.module';
import { ChessGamesModule } from './chess_games/chess_games.module';
import { PrismaService } from "./prisma/prisma.service";
import { NotificationsModule } from './notifications/notifications.module';
import { NotificationsService } from "./notifications/notifications.service";

@Module({
    imports: [UsersModule, ChessGamesModule, NotificationsModule],
    controllers: [],
    providers: [ChatGateway, ChatService, PrismaService, NotificationsService],
})

export class AppModule {}
