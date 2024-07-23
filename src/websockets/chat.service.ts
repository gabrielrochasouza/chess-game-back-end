import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class ChatService {
    private readonly connectedClients: Map<string, Socket> = new Map();

    handleConnection(socket: Socket): void {
        console.log('ChatService handleConnection');
        const clientId = socket.id;
        this.connectedClients.set(clientId, socket);

        socket.on('disconnect', () => {
            this.connectedClients.delete(clientId);
            console.log('disconnect:', clientId);
        });
        console.log('clientId: ', socket.id);

    // Handle other events and messages from the client
    }

    // Add more methods for handling events, messages, etc.
}
