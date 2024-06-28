import { Test, TestingModule } from '@nestjs/testing';
import { ChessGamesController } from './chess_games.controller';
import { ChessGamesService } from './chess_games.service';

describe('ChessGamesController', () => {
    let controller: ChessGamesController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ChessGamesController],
            providers: [ChessGamesService],
        }).compile();

        controller = module.get<ChessGamesController>(ChessGamesController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
