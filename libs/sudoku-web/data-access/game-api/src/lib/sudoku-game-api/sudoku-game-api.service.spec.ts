import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { GameApiSudoku } from './sudoku-game-api.service';
import { GameDifficulty } from '@sudoku-app-game/sudoku-models';
import {
  SudokuBoard,
  SudokuBoardSolved,
  SudokuBoardStatusResult,
} from './sudoku-game-api.model';

describe('GameApiSudoku', () => {
  let service: GameApiSudoku;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GameApiSudoku],
    });
    service = TestBed.inject(GameApiSudoku);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve a board based on difficulty and check the structure', () => {
    const mockDifficulty: GameDifficulty = 'easy';
    const expectedResponseStructure: SudokuBoard = {
      board: new Array(9).fill(new Array(9).fill(0)), // this represents an empty board structure for testing purposes
    };

    service.getBoard(mockDifficulty).subscribe((board) => {
      expect(board).toBeDefined();
      expect(board.board.length).toBe(9);
      board.board.forEach((row) => {
        expect(row.length).toBe(9);
      });
    });

    const req = httpTestingController.expectOne(
      (req) =>
        req.url.includes('board') &&
        req.params.get('difficulty') === mockDifficulty
    );
    expect(req.request.method).toBe('GET');
    req.flush(expectedResponseStructure); // Flush mock data with expected structure
  });

  it('should solve a board and return the solution', () => {
    const mockBoard: SudokuBoard = {
      board: [
        [0, 0, 0, 0, 1, 0, 0, 0, 8],
        [0, 0, 0, 0, 0, 0, 5, 0, 0],
        [0, 0, 0, 0, 0, 9, 1, 0, 0],
        [0, 1, 0, 0, 4, 0, 0, 9, 0],
        [0, 5, 6, 8, 9, 7, 0, 0, 1],
        [0, 8, 0, 0, 3, 2, 6, 0, 5],
        [0, 0, 0, 7, 0, 4, 9, 0, 6],
        [6, 0, 7, 9, 0, 0, 3, 5, 2],
        [8, 9, 0, 3, 0, 0, 7, 1, 4],
      ],
    }; // Simplified example for testing
    const mockResponse: SudokuBoardSolved = {
      solution: [
        [2, 7, 9, 5, 1, 3, 4, 6, 8],
        [4, 6, 1, 2, 7, 8, 5, 3, 9],
        [5, 3, 8, 4, 6, 9, 1, 2, 7],
        [7, 1, 2, 6, 4, 5, 8, 9, 3],
        [3, 5, 6, 8, 9, 7, 2, 4, 1],
        [9, 8, 4, 1, 3, 2, 6, 7, 5],
        [1, 2, 3, 7, 5, 4, 9, 8, 6],
        [6, 4, 7, 9, 8, 1, 3, 5, 2],
        [8, 9, 5, 3, 2, 6, 7, 1, 4],
      ], // Expected solution structure
      difficulty: 'easy',
      status: 'solved',
    };

    service.solveBoard(mockBoard).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne((req) =>
      req.url.includes('solve')
    );
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should validate a board', () => {
    const mockBoard: SudokuBoard = {
      board: [
        [2, 7, 9, 5, 1, 3, 4, 6, 8],
        [4, 6, 1, 2, 7, 8, 5, 3, 9],
        [5, 3, 8, 4, 6, 9, 1, 2, 7],
        [7, 1, 2, 6, 4, 5, 8, 9, 3],
        [3, 5, 6, 8, 9, 7, 2, 4, 1],
        [9, 8, 4, 1, 3, 2, 6, 7, 5],
        [1, 2, 3, 7, 5, 4, 9, 8, 6],
        [6, 4, 7, 9, 8, 1, 3, 5, 2],
        [8, 9, 5, 3, 2, 6, 7, 1, 4],
      ],
    }; // Simplified example for testing
    const mockResponse: SudokuBoardStatusResult = {
      status: 'solved',
    };

    service.validateBoard(mockBoard).subscribe((status) => {
      expect(status).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne((req) =>
      req.url.includes('validate')
    );
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  // Additional test: handle network errors when retrieving the board
  it('should handle network errors when retrieving the board', () => {
    const mockDifficulty: GameDifficulty = 'hard';
    const errorMsg = 'network error';

    service.getBoard(mockDifficulty).subscribe(
      () => fail('should have failed with the network error'),
      (error) => {
        expect(error.error.type).toBe('NetworkError');
        expect(error.error.message).toContain(errorMsg);
      }
    );

    const req = httpTestingController.expectOne((req) =>
      req.url.includes('board')
    );
    req.error(
      new ErrorEvent('NetworkError', {
        message: errorMsg,
      })
    );
  });
});
