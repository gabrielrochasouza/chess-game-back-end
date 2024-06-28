import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersAuthGuard } from 'src/auth_guard/users-auth.guard';

@Module({
    controllers: [UsersController],
    providers: [UsersService, PrismaService, UsersAuthGuard],
})
export class UsersModule {}
