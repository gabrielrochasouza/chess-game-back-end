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
import { NotificationsService } from "src/notifications/notifications.service";
import { UsersService } from "src/users/users.service";

interface IPayload {
  selectedLine: number;
  selectedColumn: number;
  targetLine: number;
  targetColumn: number;
  room: string,
}

interface IChatMessage {
    roomId: string,
    message: string,
    username: string,
    createdAt: Date,
}

@WebSocketGateway({ cors: true })
export class ChatGateway
implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        private readonly chatService: ChatService,
        private prisma: PrismaService,
        private notificationsService: NotificationsService,
        private userService: UsersService,
    ) {}

    private connectedUsers = {};
    private chatMessages = {};

    @WebSocketServer() server: Server;
    private logger: Logger = new Logger("AppGateway");

    afterInit() {
        console.log('afterInit');
    }

    emitInitialEvent(client: Socket) {
        console.log('emitInitialEvent');
        client.emit('initialEvent', { data: 'Server restarted and client reconnected' });
    }

    handleConnection(client: Socket): void {
        client.emit('initialEvent');
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
        this.server.emit('handleDisconnectUser', { 
            numberOfUsers: Object.keys(this.connectedUsers).length,
            users: Object.keys(this.connectedUsers)
        });
    }

    @SubscribeMessage("UserConnected")
    handleUserConnected(client: Socket, user) {
        this.connectedUsers[user.id] = this.connectedUsers[user.id] ? [ ...this.connectedUsers[user.id], client.id ] : [client.id];
        this.server.emit('handleConnectUser', { 
            sender: user.id,
            numberOfUsers: Object.keys(this.connectedUsers).length,
            users: Object.keys(this.connectedUsers)
        });
    }

    @SubscribeMessage("UserDisconnected")
    handleUserDisconnected(client: Socket, userId: string) {
        delete this.connectedUsers[userId];
        
        this.server.emit('handleDisconnectUser', { 
            sender: userId,
            numberOfUsers: Object.keys(this.connectedUsers).length,
            users: Object.keys(this.connectedUsers)
        });
    }

    @SubscribeMessage("movePiece")
    handleMovePiece(client: Socket, payload: IPayload): void {
        this.server.emit('movePiece', payload);
        this.server.emit('movePieceGlobal', payload);
    }

    @SubscribeMessage("sendChatMessage")
    async handleSendChatMessage(client: Socket, payload: { roomId: string, messages: IChatMessage[], username: string, allMessages: string, targetUserId: string }) {
        this.chatMessages[payload.roomId] = payload.messages;

        this.server.to(payload.roomId).emit('chatMessage', { 
            roomId: payload.roomId,
            chatMessages: this.chatMessages,
            username: payload.username,
        });

        await this.notificationsService.createNotification({
            targetUserId: payload.targetUserId,
            message: `New Message from ${payload.username}. "${payload.messages.slice(-1)[0].message}"`,
            roomId: payload.roomId,
            username: payload.username,
        });
        this.server.emit('sendNotification', { targetUserId: payload.targetUserId });
    }

    @SubscribeMessage("reloadInfo")
    async handleReloadInfo(client: Socket, payload: { userId: string, username: string, status: number, roomId: string }) {
        const STATUS_NO_MATCH_REQUEST = 0;
        const STATUS_MATCH_REQUEST_MADE_BY_ME = 1;
        const STATUS_GAME_STARTED = 3;

        let message;
        if (payload.status !== undefined && payload.username) {
            if (payload.status === STATUS_GAME_STARTED) {
                message = `Game started by ${payload.username}`;
            }
            if (payload.status === STATUS_NO_MATCH_REQUEST) {
                message = `Match declined by ${payload.username}`;
            }
            if (payload.status === STATUS_MATCH_REQUEST_MADE_BY_ME) {
                message = `Match request made by ${payload.username}`;
            }
        } else {
            message = 'Created Chess Room';
        }

        this.server.emit('reloadInfo', payload);
        this.server.emit('reloadGlobal', payload);
        
        if (payload.username) {
            await this.notificationsService.createNotification({
                targetUserId: payload.userId,
                message,
                roomId: payload.roomId,
                username: payload.username,
            });
            this.server.emit('sendNotification', { targetUserId: payload.userId });
        }
    }

    @SubscribeMessage('joinRoom')
    handleJoinRoom(@MessageBody() room: string, @ConnectedSocket() client: Socket): void {
        client.join(room);
        client.emit('joinedRoom', room);
    }

    @SubscribeMessage('new-user-registered')
    handleNewUser() {
        this.server.emit('new-user-registered');
    }

    @SubscribeMessage('update-room')
    handleUpdateRoom(client: Socket, payload: { roomId: string, result: number }) {
        this.server.emit('update-room', payload);
    }

    @SubscribeMessage('player-gave-up')
    handlePlayerGaveUp(client: Socket, payload: { userId: string }) {
        this.userService.updateRecord(payload.userId, 'wins');
    }

    @SubscribeMessage('reload-instances')
    handleReloadInstances(client: Socket, payload) {
        this.server.emit('reload-instances', payload);
    }

}
