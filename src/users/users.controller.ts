import { Controller, Get, Post, Body, Patch, Param, Delete, Headers, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import UserLoginDto from './dto/user-login-dto';
import { UsersAuthGuard } from 'src/auth_guard/users-auth.guard';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { NotificationsService } from 'src/notifications/notifications.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly notificationsService: NotificationsService
    ) {}

    @Post('register')
    @ApiResponse({
        status: '2XX',
        schema: { 
            example: { 
                id: 'uuid',
                username: 'username',
                active: false,
                wins: 0,
                loses: 0,
                draws: 0,
                profilePic: 'url',
                createdAt: '2024-07-23T04:56:32.775Z',
                updatedAt: '2024-07-23T04:56:32.775Z', 
            }
        },
    })
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @Post('login')
    @ApiResponse({
        status: '2XX',
        schema: { 
            example: { 
                id: 'uuid',
                username: 'username',
                active: false,
                wins: 0,
                loses: 0,
                draws: 0,
                profilePic: 'url',
                createdAt: '2024-07-23T04:56:32.775Z',
                updatedAt: '2024-07-23T04:56:32.775Z',
                expiresIn: '2024-07-23T04:56:32.775Z',
                token: 'token'
            }
        },
    })
    login(@Body() userLoginDto: UserLoginDto) {
        return this.usersService.login(userLoginDto);
    }

    @Get('me')
    getPersonalInfo(@Headers() headers: Record<string, string>) {
        return this.usersService.getPersonalInfo(headers['authorization']);
    }

    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @Get(':userId')
    findOne(@Param('userId') userId: string) {
        return this.usersService.findOne(userId);
    }

    @Get(':username/username')
    findOneByUsername(@Param('username') username: string) {
        return this.usersService.findOneByUsername(username);
    }

    @UseGuards(UsersAuthGuard)
    @Patch(':userId')
    update(@Param('userId') userId: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(userId, updateUserDto);
    }

    @UseGuards(UsersAuthGuard)
    @Patch(':userId/win')
    addWinToPlayerRecord(@Param('userId') userId: string) {
        return this.usersService.updateRecord(userId, 'wins');
    }

    @UseGuards(UsersAuthGuard)
    @Patch(':userId/lose')
    addLoseToPlayerRecord(@Param('userId') userId: string) {
        return this.usersService.updateRecord(userId, 'loses');
    }

    @UseGuards(UsersAuthGuard)
    @Patch(':userId/draw')
    addDrawToPlayerRecord(@Param('userId') userId: string) {
        return this.usersService.updateRecord(userId, 'draws');
    }

    @UseGuards(UsersAuthGuard)
    @Delete(':userId')
    remove(@Param('userId') userId: string) {
        return this.usersService.remove(userId);
    }

    @UseGuards(UsersAuthGuard)
    @Get(':userId/read-all-notifications')
    readAllNotifications(@Param('userId') userId: string) {
        return this.notificationsService.readAllNotifications(userId);
    }
}
