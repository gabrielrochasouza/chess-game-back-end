import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateChessGameDto } from './dto/create-chess_game.dto';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChessGamesService {
    constructor (private prisma: PrismaService) {}

    async getChessGame({ userId }: CreateChessGameDto, authorization: string) {        
        try {
            const userId1 = this.getUserDataFromToken(authorization).id;
            const userId2 = userId;

            await this.verifyPlayerExistence(userId1);
            await this.verifyPlayerExistence(userId2);

            const search1 = await this.searchForGame(userId1, userId2);
            if (search1) {
                return search1;
            }            
            const search2 = await this.searchForGame(userId2, userId1);
            if (search2) {
                return search2;
            }

            return this.prisma.chessGames.create({ data: { userId1, userId2 } });
        } catch (e) {
            throw e;
        }
    }

    async setChessPlayerColor(chessGameId: string) {
        try {
            const chessGame = await this.verifyChessGameExistence(chessGameId);

            const zeroOrOne = Math.round(Math.random());

            return await this.prisma.chessGames.update({
                where: {
                    id: chessGameId,
                },
                data: {
                    blackPieceUser: zeroOrOne === 0 ? chessGame.userId1 : chessGame.userId2,
                    whitePieceUser: zeroOrOne === 0 ? chessGame.userId2 : chessGame.userId1,
                },
            });

        } catch (e) {
            throw e;
        }
    }

    async verifyPlayerExistence(userId: string) {
        await this.prisma.users.findUniqueOrThrow({
            where: {
                id: userId
            }
        }).catch(() => {
            throw new NotFoundException('User Not Found')
        });
    }

    async verifyChessGameExistence(id: string) {
        return await this.prisma.chessGames.findUniqueOrThrow({ where: { id }})
            .catch(() => {
                throw new NotFoundException('Chess Game Not Found')
            });
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

}
