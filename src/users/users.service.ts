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

    async findAll() {
        const users = await this.prisma.users.findMany({ omit: { password: true }, orderBy: { wins: 'desc' } });
        return users.map((user, index) => ({ position: index + 1, ...user }));
    }

    async findOne(id: string) {
        const user = await this.prisma.users.findUniqueOrThrow({ 
            where: { id },
            omit: { password: true },
            include: {
                notifications: true,
            }
        }).catch(() => {
            throw new NotFoundException();
        });

        return user;
    }

    async findOneByUsername(username: string) {
        const user = await this.prisma.users.findUniqueOrThrow({ 
            where: { username },
            omit: { password: true }
        }).catch(() => {
            throw new NotFoundException();
        });

        return user;
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        try {
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
        } catch (error) {
            throw error;
        }
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

        const expireTimeHours = 3;
        
        const token = jwt.sign({ username: user.username, id: user.id }, env['SECRET_KEY'], { expiresIn: `${expireTimeHours}h` });
        
        return { token, expiresIn: new Date(Date.now() + expireTimeHours * 60 * 60 * 1000) , ...user };
    }

    async getPersonalInfo (authorization: string) {
        try {
            const token = authorization.split(' ')[1];
            if(jwt.verify(token, env['SECRET_KEY'])) {
                const data = jwt.decode(token);
                return {
                    user: await this.findOne(data['id']),
                    chessGames: [
                        ...await this.prisma.chessGames.findMany({
                            where: {
                                userId1: data['id'],
                            }
                        }),
                        ...await this.prisma.chessGames.findMany({
                            where: {
                                userId2: data['id'],
                            }
                        })
                    ]
                };
            }
        } catch (e) {
            throw e;
        }
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
