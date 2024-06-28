import { Logger } from "@nestjs/common";
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ChatService } from "./chat.service";

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
    constructor(private readonly chatService: ChatService) {}

    private connectedUsers = new Map<string, Socket>();
    private rooms = new Map<string, string>();
    private chessRooms = {};
    private onlineUsers = {};

    @WebSocketServer() server: Server;
    private logger: Logger = new Logger("AppGateway");

    afterInit(server: any) {
        this.logger.log("init");
        this.logger.log(server);
    }

    handleConnection(socket: Socket): void {
        console.log(`Client connected: ${socket.id}`);
        this.connectedUsers.set(socket.id, socket);

        this.server.emit('handleConnection', { 
            sender: socket.id,
            numberOfUsers: this.connectedUsers.size,
            users: this.connectedUsers.keys()
        });
    }

    handleDisconnect(client: any) {
        this.logger.log("client disconnected: " + client.id);
        this.connectedUsers.delete(client.id);
        // Remove user from room when disconnected
        const room = this.rooms.get(client.id);
        if (room) {
            client.leave(room);
            this.rooms.delete(client.id);
        }
        this.server.emit('handleDisconnect', { 
            sender: client.id, 
            numberOfUsers: this.connectedUsers.size, 
            users: JSON.stringify(this.connectedUsers) 
        });
    }

    @SubscribeMessage("joinRoom")
    handleJoinRoom(client: Socket, room: string) {
        const usersInRoom = Array.from(this.rooms.values()).filter(
            (r) => r === room,
        );

        if (usersInRoom.length > 2) {
            // Room already has a user, handle as needed (reject or disconnect)
            return;
        }
        client.join(room);
        
        this.rooms.set(client.id, room);

        if (!this.chessRooms[room]?.length) {
            this.chessRooms[room] = [client.id];
            console.log(this.chessRooms);
        } else if (!this.chessRooms[room].includes(client.id)) {
            this.chessRooms[room] = [...this.chessRooms[room], client.id];
            console.log(this.chessRooms);
        }
        
        this.server.to(room).emit('joinRoom', { sender: client.id, room: this.chessRooms });
    }

    @SubscribeMessage("message")
    handleMessage(client: Socket, payload: IPayload): void {
        // const { room } = payload;
        this.server.emit('message', { sender: client.id, payload });
    }
}
