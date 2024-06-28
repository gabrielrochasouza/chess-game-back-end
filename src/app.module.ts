import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ChatGateway } from "./chat.gateway";
import { ChatService } from "./chat.service";

@Module({
    imports: [],
    controllers: [AppController],
    providers: [AppService, ChatGateway, ChatService],
})

export class AppModule {}
