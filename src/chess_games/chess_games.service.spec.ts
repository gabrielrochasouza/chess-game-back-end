import { Test, TestingModule } from '@nestjs/testing';
import { ChessGamesService } from './chess_games.service';

describe('ChessGamesService', () => {
    let service: ChessGamesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ChessGamesService],
        }).compile();

        service = module.get<ChessGamesService>(ChessGamesService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
