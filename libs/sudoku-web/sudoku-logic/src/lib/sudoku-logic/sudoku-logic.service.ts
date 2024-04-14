import { GameApiSudoku } from '@sudoku-app-game/game-api';
import {
  GameDifficulty,
  GameStatus,
  SudokuCell,
  CellType,
} from '@sudoku-app-game/sudoku-models';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { Injectable } from '@angular/core';
import { SudokuMultiplayer } from './sudoku-multiplayer.service';

@Injectable({ providedIn: 'root' })
export class SudokuLogic {
  board$: BehaviorSubject<SudokuCell[][]>;
  status$: BehaviorSubject<GameStatus>;
  difficulty$: BehaviorSubject<GameDifficulty>;
  private board: SudokuCell[][];
  private status: GameStatus;
  private difficulty: GameDifficulty;

  constructor(
    private readonly apiSudoku: GameApiSudoku,
    private readonly sudokuMultiplayer: SudokuMultiplayer
  ) {
    this.board = this.initializeBoard();
    this.board$ = new BehaviorSubject(this.board);
    this.status = 'unsolved';
    this.status$ = new BehaviorSubject<GameStatus>(this.status);
    this.difficulty = 'random';
    this.difficulty$ = new BehaviorSubject<GameDifficulty>(this.difficulty);

    this.sudokuMultiplayer.initBoard$.subscribe(
      (boardCoop: SudokuCell[][] | null) => {
        if (!boardCoop) return;
        this.board = boardCoop;
        this.board$.next(this.board);
      }
    );
  }

  initializeBoard(): SudokuCell[][] {
    const board: SudokuCell[][] = [];
    for (let i = 0; i < 9; i++) {
      board.push([]);
      for (let j = 0; j < 9; j++) {
        board[i].push({
          type: CellType.INPUT,
          value: 0,
        });
      }
    }

    return board;
  }

  setValue(x: number, y: number, value: number) {
    if (x < 0 || x > 9) {
      throw new Error('X must be between 0 and 9');
    }

    if (y < 0 || y > 9) {
      throw new Error('Y must be between 0 and 9');
    }

    if (value < 0 || value > 9) {
      throw new Error('Value must be between 0 and 9');
    }

    this.sudokuMultiplayer.emitUpdateBoard({ x, y, value });
    this.board[x][y] = { value, type: CellType.INPUT };
  }

  async setNewBoard(difficulty: GameDifficulty) {
    const { board } = await firstValueFrom(this.apiSudoku.getBoard(difficulty));
    this.board = board.map((col) =>
      col.map((value): SudokuCell => {
        return {
          value: value,
          type: value === 0 ? CellType.INPUT : CellType.FIXED,
        };
      })
    );
    this.board$.next(this.board);
    this.difficulty = difficulty;
    this.difficulty$.next(this.difficulty);
    this.status = 'unsolved';
    this.status$.next(this.status);
  }

  async solveBoard() {
    const { solution, status, difficulty } = await firstValueFrom(
      this.apiSudoku.solveBoard({
        board: this.board.map((col) =>
          col.map((value) => (value.type === CellType.FIXED ? value.value : 0))
        ),
      })
    );
    this.board = solution.map((col, colIdx) =>
      col.map(
        (value, rowIdx): SudokuCell => ({
          value,
          type:
            this.board[colIdx][rowIdx].type === CellType.INPUT
              ? CellType.GENERATED
              : CellType.FIXED,
        })
      )
    );

    this.board$.next(this.board);
    this.difficulty = difficulty;
    this.difficulty$.next(this.difficulty);
    this.status = status;
    this.status$.next(this.status);
  }

  async validateBoard() {
    const { status } = await firstValueFrom(
      this.apiSudoku.validateBoard({
        board: this.board.map((col) => col.map((value) => value.value)),
      })
    );
    this.status = status;
    this.status$.next(this.status);
  }

  initMultiplayer(roomId: string) {
    this.sudokuMultiplayer.init(roomId, this.board);
  }
}
