import { GameApiSudoku } from '@sudoku-app-game/game-api';
import { GameDifficulty, GameStatus } from '@sudoku-app-game/sudoku-models';

import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SudokuLogic {
  private _board: number[][];
  private status: GameStatus;
  private difficulty: GameDifficulty;

  constructor(private readonly apiSudoku: GameApiSudoku) {
    this._board = this.initializeBoard();
    this.status = 'unsolved';
    this.difficulty = 'random';
  }

  initializeBoard(): number[][] {
    const board: number[][] = [];
    for (let i = 0; i < 9; i++) {
      board.push([]);
      for (let j = 0; j < 9; j++) {
        board[i].push(0);
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

    this._board[x][y] = value;
  }

  async setNewBoard(difficulty: GameDifficulty) {
    const { board } = await firstValueFrom(this.apiSudoku.getBoard(difficulty));
    this._board = board;
    this.difficulty = difficulty;
    this.status = 'unsolved';
  }

  async solveBoard() {
    const { solution, status, difficulty } = await firstValueFrom(
      this.apiSudoku.solveBoard({ board: this._board })
    );
    this._board = solution;
    this.difficulty = difficulty;
    this.status = status;
  }

  async validateBoard() {
    const { status } = await firstValueFrom(
      this.apiSudoku.validateBoard({ board: this._board })
    );
    this.status = status;
  }

  get board(): number[][] {
    return this._board;
  }
}
