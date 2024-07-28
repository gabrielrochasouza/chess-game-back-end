import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersAuthGuard } from 'src/auth_guard/users-auth.guard';
import { NotificationsService } from 'src/notifications/notifications.service';

@Module({
    controllers: [UsersController],
    providers: [UsersService, PrismaService, UsersAuthGuard, NotificationsService],
})
export class UsersModule {}
