import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateChessGameDto } from './dto/create-chess_game.dto';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatChessGameDto } from './dto/chat-chess-game.dto';

@Injectable()
export class ChessGamesService {
    constructor (private prisma: PrismaService) {}

    async createChessGame({ userId }: CreateChessGameDto, authorization: string) {
        try {
            const userId1 = this.getUserDataFromToken(authorization).id;
            const userId2 = userId;

            const user1 = await this.getPlayer(userId1);
            const user2 = await this.getPlayer(userId2);
            
            const username1 = user1.username;
            const username2 = user2.username;

            const search1 = await this.searchForGame(userId1, userId2);
            if (search1) {
                return search1;
            }            
            const search2 = await this.searchForGame(userId2, userId1);
            if (search2) {
                return search2;
            }
            const chessGame = this.prisma.chessGames.create({ data: { userId1, userId2, username1, username2 } });

            return { ...chessGame, user1, user2 };
        } catch (e) {
            throw e;
        }
    }

    async startChessGame(chessGameId: string, authorization: string) {
        try {
            const { chessGame } = await this.verifyUser(chessGameId, authorization);

            const zeroOrOne = Math.round(Math.random());

            return await this.prisma.chessGames.update({
                where: {
                    id: chessGameId,
                },
                data: {
                    blackPieceUser: zeroOrOne === 0 ? chessGame.userId1 : chessGame.userId2,
                    whitePieceUser: zeroOrOne === 0 ? chessGame.userId2 : chessGame.userId1,
                    matchRequestMade: false,
                    userIdOfRequest: null,
                    gameStarted: true,
                },
            });

        } catch (e) {
            throw e;
        }
    }

    async getPlayer(userId: string) {
        return await this.prisma.users.findUniqueOrThrow({ where: { id: userId } })
            .catch(() => { throw new NotFoundException('User Not Found') });
    }

    async getChessGame(id: string) {
        const chessGame = await this.prisma.chessGames.findUniqueOrThrow({ where: { id }})
            .catch(() => {
                throw new NotFoundException('Chess Game Not Found')
            });
        
        const user1 = await this.getPlayer(chessGame.userId1);
        const user2 = await this.getPlayer(chessGame.userId2);
        
        return { ...chessGame, user1, user2 }
    }

    async searchForGame(userId1: string, userId2: string) {
        const chessgame = await this.prisma.chessGames.findMany({
            where: {
                userId1,
                userId2,
            }
        })
        if (chessgame.length) {
            return chessgame[0];
        }
    }

    getUserDataFromToken(authorization: string) {
        const token = authorization.split(' ')[1];
        const data = jwt.decode(token);

        return {
            id: data['id'],
            username: data['username'],
        };
    }

    async makeMatchRequest(id: string, authorization: string) {
        try {
            const { userId } = await this.verifyUser(id, authorization);

            return this.prisma.chessGames.update({
                where: { id },
                data: {
                    matchRequestMade: true,
                    userIdOfRequest: userId,
                }
            });
        } catch (e) {
            throw e;
        }
    }

    async saveChat(chessGameId: string, {chat}: ChatChessGameDto, authorization: string) {
        try {
            await this.verifyUser(chessGameId, authorization);

            return this.prisma.chessGames.update({
                where: { id: chessGameId },
                data: {
                    chatMessages: chat,
                }
            });
        } catch (e) {
            throw e;
        }
    }

    async finishGame (chessGameId: string, authorization: string) {
        try {
            await this.verifyUser(chessGameId, authorization);

            return this.prisma.chessGames.update({
                where: { id: chessGameId },
                data: {
                    matchRequestMade: false,
                    userIdOfRequest: null,
                    gameStarted: false,
                }
            });

        } catch (e) {
            throw e;
        }
    }

    async verifyUser (chessGameId: string, authorization: string) {
        try {
            const chessGame = await this.getChessGame(chessGameId);
            const userId = this.getUserDataFromToken(authorization).id;
    
            if (chessGame.userId1 !== userId && chessGame.userId2 !== userId) {
                throw new UnauthorizedException()
            }

            return { chessGame, userId };
        } catch (e) {
            throw e;
        }
    }

}
