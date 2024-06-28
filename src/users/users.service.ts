import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import UserLoginDto from './dto/user-login-dto';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { env } from 'process';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async create(createUserDto: CreateUserDto) {
        try {
            createUserDto.password = await bcrypt.hash(createUserDto.password, 10);

            return await this.prisma.users.create({
                data: createUserDto,
                omit: { password: true }
            });
        } catch (error) {
            throw error;
        }
    }

    findAll() {
        return this.prisma.users.findMany({ omit: { password: true } });
    }

    async findOne(id: string) {
        const user = await this.prisma.users.findUniqueOrThrow({ 
            where: { id },
            omit: { password: true }
        }).catch(() => {
            throw new NotFoundException();
        });

        return user;
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        await this.verifyUserExistence(id);

        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }

        return this.prisma.users.update({
            data: updateUserDto,
            omit: { password: true },
            where: {
                id,
            }
        });
    }

    async remove(id: string) {
        await this.verifyUserExistence(id);

        return this.prisma.users.delete({ where: { id } });
    }

    async verifyUserExistence(id: string) {
        await this.prisma.users.findUniqueOrThrow({ where: { id } })
            .catch(() => {
                throw new NotFoundException();
            });
    }

    async login (userLoginDto: UserLoginDto) {
        const user = await this.prisma.users.findUniqueOrThrow({
            where: {
                username: userLoginDto.username,
            }
        }).catch(() => {
            throw new UnauthorizedException('Invalid credentials');
        });

        const isPasswordValid = await bcrypt.compare(userLoginDto.password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }
        
        const token = jwt.sign({ username: user.username, id: user.id }, env['SECRET_KEY'], { expiresIn: '1h' });
        
        return { token, id: user.id };
    }

    async getPersonalInfo (authorization: string) {
        try {
            const token = authorization.split(' ')[1];
            if(jwt.verify(token, env['SECRET_KEY'])) {
                const data = jwt.decode(token);
                return this.findOne(data['id']);
            }
        } catch (e) {
            throw new UnauthorizedException('Invalid Token');
        }
    }

    async addWinToPlayerRecord (id: string) {
        return this.updateRecord(id, 'wins');
    }

    async addLoseToPlayerRecord (id: string) {
        return this.updateRecord(id, 'loses');
    }

    async addDrawToPlayerRecord (id: string) {
        return this.updateRecord(id, 'draws');
    }

    async updateRecord (id: string, entity: 'wins' | 'loses' | 'draws') {
        try {
            const user = await this.findOne(id);

            return this.prisma.users.update({
                where: { id },
                data: { [entity]: user[entity] + 1 },
            });
        } catch (e) {
            throw new UnauthorizedException('Invalid Token');
        }
    }

}
