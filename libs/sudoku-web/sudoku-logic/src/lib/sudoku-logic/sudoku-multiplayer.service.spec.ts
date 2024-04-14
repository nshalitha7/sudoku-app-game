import { TestBed } from '@angular/core/testing';
import { SudokuMultiplayer } from './sudoku-multiplayer.service';
import { io } from 'socket.io-client';
import {
  BoardInformation,
  CellType,
  UpdateBoardMessage,
} from '@sudoku-app-game/sudoku-models';

// Mock the `io` function from `socket.io-client`
jest.mock('socket.io-client', () => ({
  io: jest.fn(),
}));

describe('SudokuMultiplayer', () => {
  let service: SudokuMultiplayer;
  let socketMock: {
    on: jest.Mock;
    emit: jest.Mock;
    connected: boolean;
    disconnect: jest.Mock;
  };

  beforeEach(() => {
    // Reset the mock for each test to ensure clean test data
    socketMock = {
      on: jest.fn(),
      emit: jest.fn(),
      connected: false,
      disconnect: jest.fn(),
    };

    (io as jest.Mock).mockReturnValue(socketMock);

    TestBed.configureTestingModule({
      providers: [SudokuMultiplayer],
    });
    service = TestBed.inject(SudokuMultiplayer);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('init', () => {
    it('should initialize socket connection with correct parameters', () => {
      const gameId = '1231';
      const boardInfo: BoardInformation = {
        board: [
          [
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 1 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 8 },
          ],
          [
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 5 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
          ],
          [
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 9 },
            { type: CellType.FIXED, value: 1 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
          ],
          [
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 1 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 4 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 9 },
            { type: CellType.INPUT, value: 0 },
          ],
          [
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 5 },
            { type: CellType.FIXED, value: 6 },
            { type: CellType.FIXED, value: 8 },
            { type: CellType.FIXED, value: 9 },
            { type: CellType.FIXED, value: 7 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 1 },
          ],
          [
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 8 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 3 },
            { type: CellType.FIXED, value: 2 },
            { type: CellType.FIXED, value: 6 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 5 },
          ],
          [
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 7 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 4 },
            { type: CellType.FIXED, value: 9 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 6 },
          ],
          [
            { type: CellType.FIXED, value: 6 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 7 },
            { type: CellType.FIXED, value: 9 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 3 },
            { type: CellType.FIXED, value: 5 },
            { type: CellType.FIXED, value: 2 },
          ],
          [
            { type: CellType.FIXED, value: 8 },
            { type: CellType.FIXED, value: 9 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 3 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 7 },
            { type: CellType.FIXED, value: 1 },
            { type: CellType.FIXED, value: 4 },
          ],
        ],
        status: 'unsolved',
        difficulty: 'easy',
      };
      service.init(gameId, boardInfo);

      expect(io).toHaveBeenCalledWith('http://localhost:3333', {
        query: { gameId },
      });
      expect(socketMock.on).toHaveBeenCalled();
      expect(service.isConnected()).toBe(false); // As socket.connected is false by default in the mock
    });

    it('should handle "init-board" event correctly', () => {
      const boardInfo: BoardInformation = {
        board: [
          [
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 1 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 8 },
          ],
          [
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 5 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
          ],
          [
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 9 },
            { type: CellType.FIXED, value: 1 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
          ],
          [
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 1 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 4 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 9 },
            { type: CellType.INPUT, value: 0 },
          ],
          [
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 5 },
            { type: CellType.FIXED, value: 6 },
            { type: CellType.FIXED, value: 8 },
            { type: CellType.FIXED, value: 9 },
            { type: CellType.FIXED, value: 7 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 1 },
          ],
          [
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 8 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 3 },
            { type: CellType.FIXED, value: 2 },
            { type: CellType.FIXED, value: 6 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 5 },
          ],
          [
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 7 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 4 },
            { type: CellType.FIXED, value: 9 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 6 },
          ],
          [
            { type: CellType.FIXED, value: 6 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 7 },
            { type: CellType.FIXED, value: 9 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 3 },
            { type: CellType.FIXED, value: 5 },
            { type: CellType.FIXED, value: 2 },
          ],
          [
            { type: CellType.FIXED, value: 8 },
            { type: CellType.FIXED, value: 9 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 3 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 7 },
            { type: CellType.FIXED, value: 1 },
            { type: CellType.FIXED, value: 4 },
          ],
        ],
        status: 'unsolved',
        difficulty: 'easy',
      };
      service.init('game123', boardInfo);

      const callback = socketMock.on.mock.calls.find(
        (call) => call[0] === 'init-board'
      )[1];
      callback(boardInfo);

      expect(service.multiplayerBoard$.getValue()).toEqual(boardInfo);
    });
  });

  describe('emit methods', () => {
    it('should emit "update-board" correctly', () => {
      const boardInfo: BoardInformation = {
        board: [
          [
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 1 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 8 },
          ],
          [
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 5 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
          ],
          [
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 9 },
            { type: CellType.FIXED, value: 1 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
          ],
          [
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 1 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 4 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 9 },
            { type: CellType.INPUT, value: 0 },
          ],
          [
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 5 },
            { type: CellType.FIXED, value: 6 },
            { type: CellType.FIXED, value: 8 },
            { type: CellType.FIXED, value: 9 },
            { type: CellType.FIXED, value: 7 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 1 },
          ],
          [
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 8 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 3 },
            { type: CellType.FIXED, value: 2 },
            { type: CellType.FIXED, value: 6 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 5 },
          ],
          [
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 7 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 4 },
            { type: CellType.FIXED, value: 9 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 6 },
          ],
          [
            { type: CellType.FIXED, value: 6 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 7 },
            { type: CellType.FIXED, value: 9 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 3 },
            { type: CellType.FIXED, value: 5 },
            { type: CellType.FIXED, value: 2 },
          ],
          [
            { type: CellType.FIXED, value: 8 },
            { type: CellType.FIXED, value: 9 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 3 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 7 },
            { type: CellType.FIXED, value: 1 },
            { type: CellType.FIXED, value: 4 },
          ],
        ],
        status: 'unsolved',
        difficulty: 'easy',
      };
      service.init('1221', boardInfo);
      const updateMsg: UpdateBoardMessage = { x: 1, y: 1, value: 5 };
      service.emitUpdateBoard(updateMsg);

      expect(socketMock.emit).toHaveBeenCalledWith('update-board', updateMsg);
    });

    it('should not emit if socket is not connected', () => {
      service.disconnect();
      service.emitUpdateBoard({ x: 1, y: 1, value: 5 });

      expect(socketMock.emit).not.toHaveBeenCalled();
    });
  });

  describe('disconnect', () => {
    it('should disconnect and nullify the socket', () => {
      const boardInfo: BoardInformation = {
        board: [
          [
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 1 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 8 },
          ],
          [
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 5 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
          ],
          [
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 9 },
            { type: CellType.FIXED, value: 1 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
          ],
          [
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 1 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 4 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 9 },
            { type: CellType.INPUT, value: 0 },
          ],
          [
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 5 },
            { type: CellType.FIXED, value: 6 },
            { type: CellType.FIXED, value: 8 },
            { type: CellType.FIXED, value: 9 },
            { type: CellType.FIXED, value: 7 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 1 },
          ],
          [
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 8 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 3 },
            { type: CellType.FIXED, value: 2 },
            { type: CellType.FIXED, value: 6 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 5 },
          ],
          [
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 7 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 4 },
            { type: CellType.FIXED, value: 9 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 6 },
          ],
          [
            { type: CellType.FIXED, value: 6 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 7 },
            { type: CellType.FIXED, value: 9 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 3 },
            { type: CellType.FIXED, value: 5 },
            { type: CellType.FIXED, value: 2 },
          ],
          [
            { type: CellType.FIXED, value: 8 },
            { type: CellType.FIXED, value: 9 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 3 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.INPUT, value: 0 },
            { type: CellType.FIXED, value: 7 },
            { type: CellType.FIXED, value: 1 },
            { type: CellType.FIXED, value: 4 },
          ],
        ],
        status: 'unsolved',
        difficulty: 'easy',
      };
      service.init('453', boardInfo);
      service.disconnect();

      expect(socketMock.disconnect).toHaveBeenCalled();
      expect(service.isConnected()).not.toBe(true);
    });
  });
});
