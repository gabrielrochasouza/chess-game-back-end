import { Controller, Get, Post, Body, Patch, Param, Delete, Headers, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import UserLoginDto from './dto/user-login-dto';
import { UsersAuthGuard } from 'src/auth_guard/users-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @Post('login')
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

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    @UseGuards(UsersAuthGuard)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(id, updateUserDto);
    }

    @UseGuards(UsersAuthGuard)
    @Patch(':id/win')
    addWinToPlayerRecord(@Param('id') id: string) {
        return this.usersService.addWinToPlayerRecord(id);
    }

    @UseGuards(UsersAuthGuard)
    @Patch(':id/lose')
    addLoseToPlayerRecord(@Param('id') id: string) {
        return this.usersService.addLoseToPlayerRecord(id);
    }

    @UseGuards(UsersAuthGuard)
    @Patch(':id/draw')
    addDrawToPlayerRecord(@Param('id') id: string) {
        return this.usersService.addDrawToPlayerRecord(id);
    }

    @UseGuards(UsersAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.usersService.remove(id);
    }
}
