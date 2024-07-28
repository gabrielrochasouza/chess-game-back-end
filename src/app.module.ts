import { Module } from "@nestjs/common";
import { ChatGateway } from "./websockets/chat.gateway";
import { ChatService } from "./websockets/chat.service";
import { UsersModule } from './users/users.module';
import { ChessGamesModule } from './chess_games/chess_games.module';
import { PrismaService } from "./prisma/prisma.service";
import { NotificationsModule } from './notifications/notifications.module';
import { NotificationsService } from "./notifications/notifications.service";
import { HealthcheckModule } from './healthcheck/healthcheck.module';
import { ScheduleModule } from "@nestjs/schedule";
import { HttpModule } from "@nestjs/axios";
import { HealthcheckService } from "./healthcheck/healthcheck.service";

@Module({
    imports: [
        UsersModule,
        ChessGamesModule,
        HealthcheckModule,
        NotificationsModule,
        HttpModule,
        ScheduleModule.forRoot(),
    ],
    controllers: [],
    providers: [
        ChatGateway,
        ChatService,
        PrismaService,
        NotificationsService,
        HealthcheckService,
    ],
})

export class AppModule {}
