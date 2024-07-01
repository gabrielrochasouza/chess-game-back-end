import { Logger } from "@nestjs/common";
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ChatService } from "./chat.service";
import { PrismaService } from 'src/prisma/prisma.service';

interface IPayload {
  selectedLine: number;
  selectedColumn: number;
  targetLine: number;
  targetColumn: number;
  room: string,
}

@WebSocketGateway({ cors: true })
export class ChatGateway
implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(private readonly chatService: ChatService, private prisma: PrismaService) {}

    private connectedUsers = {};
    private chatMessages = {};

    @WebSocketServer() server: Server;
    private logger: Logger = new Logger("AppGateway");

    afterInit() {
        console.log('afterInit');
    }

    handleConnection(): void {
        console.log('handleConnection');
    }

    handleDisconnect(client: Socket) {
        Object.entries(this.connectedUsers).forEach(([userId, socketIds]) => {
            if (Array.isArray(socketIds) && socketIds.some(s => s === client.id)) {
                this.connectedUsers[userId] = socketIds.filter(s => s !== client.id);
                if (this.connectedUsers[userId].length === 0) {
                    delete this.connectedUsers[userId]
                }
            }
        });
        this.server.emit('handleConnect', { 
            numberOfUsers: Object.keys(this.connectedUsers).length,
            users: Object.keys(this.connectedUsers)
        });
    }

    @SubscribeMessage("UserConnected")
    handleUserConnected(client: Socket, user) {
        this.connectedUsers[user.id] = this.connectedUsers[user.id] ? [ ...this.connectedUsers[user.id], client.id ] : [client.id];
        this.server.emit('handleConnect', { 
            sender: user.id,
            numberOfUsers: Object.keys(this.connectedUsers).length,
            users: Object.keys(this.connectedUsers)
        });
    }

    @SubscribeMessage("message")
    handleMessage(client: Socket, payload: IPayload): void {
        this.server.emit('message', { sender: client.id, payload });
    }

    @SubscribeMessage("sendChatMessage")
    handleSendChatMessage(client: Socket, payload: { roomId: string, message: string, username: string, allMessages: string }): void {
        const message = {
            message: payload.message,
            createdAt: new Date(),
            username: payload.username
        };

        this.chatMessages[payload.roomId] = this.chatMessages[payload.roomId] ? [...this.chatMessages[payload.roomId], message] : [message];

        this.server.to(payload.roomId).emit('chatMessage', { 
            roomId: payload.roomId,
            chatMessages: this.chatMessages,
            username: payload.username,
        });
    }

    @SubscribeMessage('joinRoom')
    handleJoinRoom(@MessageBody() room: string, @ConnectedSocket() client: Socket): void {
        client.join(room);
        client.emit('joinedRoom', room);
    }

}
