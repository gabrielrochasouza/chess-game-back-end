import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
    providers: [NotificationsService, PrismaService],
})
export class NotificationsModule {}
