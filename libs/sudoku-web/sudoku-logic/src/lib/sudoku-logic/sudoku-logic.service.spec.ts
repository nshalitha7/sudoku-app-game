import { TestBed } from '@angular/core/testing';
import { SudokuLogic } from './sudoku-logic.service';
import { GameApiSudoku } from '@sudoku-app-game/game-api';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

jest.mock('@sudoku-app-game/game-api');

describe('SudokuLogic', () => {
  let service: SudokuLogic;
  let apiSudokuMock: {
    solveBoard: jest.Mock;
    getBoard: jest.Mock;
    validateBoard: jest.Mock;
  };

  beforeEach(() => {
    apiSudokuMock = {
      getBoard: jest.fn(),
      solveBoard: jest.fn(),
      validateBoard: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SudokuLogic,
        { provide: GameApiSudoku, useValue: apiSudokuMock },
      ],
    });

    service = TestBed.inject(SudokuLogic);
    setupMocks();
  });

  function setupMocks() {
    // Initialize with a fully zeroed 9x9 board for the mock getBoard
    apiSudokuMock.getBoard.mockReturnValue(
      of({
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
      })
    );
    // Mock solveBoard to return a completely solved 9x9 board
    apiSudokuMock.solveBoard.mockReturnValue(
      of({
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
        ],
        status: 'solved',
        difficulty: 'medium',
      })
    );
    apiSudokuMock.validateBoard.mockReturnValue(of({ status: 'solved' }));
  }

  it('should be created', () => {
    expect(service).toBeDefined();
  });

  it('should initialize the board with zeros', () => {
    const board = service.initializeBoard();
    expect(board.length).toBe(9);
    board.forEach((row) => {
      expect(row.length).toBe(9);
      row.forEach((cell) => expect(cell.value).toBe(0));
    });
  });

  it('should fetch a new board and set it with correct difficulty', async () => {
    await service.setNewBoard('easy');
    expect(apiSudokuMock.getBoard).toHaveBeenCalledWith('easy');
    const sudokuBoard = service['board'].map((row) =>
      row.map((cell) => cell.value)
    );
    expect(sudokuBoard).toEqual([
      [0, 0, 0, 0, 1, 0, 0, 0, 8],
      [0, 0, 0, 0, 0, 0, 5, 0, 0],
      [0, 0, 0, 0, 0, 9, 1, 0, 0],
      [0, 1, 0, 0, 4, 0, 0, 9, 0],
      [0, 5, 6, 8, 9, 7, 0, 0, 1],
      [0, 8, 0, 0, 3, 2, 6, 0, 5],
      [0, 0, 0, 7, 0, 4, 9, 0, 6],
      [6, 0, 7, 9, 0, 0, 3, 5, 2],
      [8, 9, 0, 3, 0, 0, 7, 1, 4],
    ]);
    expect(service['difficulty']).toBe('easy');
    expect(service['status']).toBe('unsolved');
  });

  it('should solve the board using the API and update the state', async () => {
    await service.setNewBoard('medium');
    expect(apiSudokuMock.getBoard).toHaveBeenCalledWith('medium');
    await service.solveBoard();
    const sudokuBoard = service['board'].map((row) =>
      row.map((cell) => cell.value)
    );
    expect(sudokuBoard).toEqual([
      [2, 7, 9, 5, 1, 3, 4, 6, 8],
      [4, 6, 1, 2, 7, 8, 5, 3, 9],
      [5, 3, 8, 4, 6, 9, 1, 2, 7],
      [7, 1, 2, 6, 4, 5, 8, 9, 3],
      [3, 5, 6, 8, 9, 7, 2, 4, 1],
      [9, 8, 4, 1, 3, 2, 6, 7, 5],
      [1, 2, 3, 7, 5, 4, 9, 8, 6],
      [6, 4, 7, 9, 8, 1, 3, 5, 2],
      [8, 9, 5, 3, 2, 6, 7, 1, 4],
    ]); // Assuming this is the mock solution
    expect(service['status']).toBe('solved');
    expect(service['difficulty']).toBe('medium');
  });

  it('should validate the board using the API and update the status', async () => {
    await service.validateBoard();
    const sudokuBoard = service['board'].map((row) =>
      row.map((cell) => cell.value)
    );
    expect(apiSudokuMock.validateBoard).toHaveBeenCalledWith({
      board: sudokuBoard,
    });
    expect(service['status']).toBe('solved');
  });
});
