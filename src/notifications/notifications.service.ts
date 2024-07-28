import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotificationsService {
    constructor(private prisma: PrismaService) {}

    async createNotification({ message, targetUserId, username, roomId }: CreateNotificationDto) {
        return this.prisma.notifications.create({ data: {
            message,
            targetUserId,
            username,
            roomId,
        }});
    }

    async readAllNotifications(targetUserId: string) {
        return this.prisma.notifications.updateMany({
            where: { targetUserId, }, data: { readMessageAt: new Date() }
        });
    }

}
