import { GameApiSudoku } from '@sudoku-app-game/game-api';
import { GameDifficulty, GameStatus } from '@sudoku-app-game/sudoku-models';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SudokuLogic {
  board$: BehaviorSubject<number[][]>;
  status$: BehaviorSubject<GameStatus>;
  difficulty$: BehaviorSubject<GameDifficulty>;
  private board: number[][];
  private status: GameStatus;
  private difficulty: GameDifficulty;

  constructor(private readonly apiSudoku: GameApiSudoku) {
    this.board = this.initializeBoard();
    this.board$ = new BehaviorSubject(this.board);
    this.status = 'unsolved';
    this.status$ = new BehaviorSubject<GameStatus>(this.status);
    this.difficulty = 'random';
    this.difficulty$ = new BehaviorSubject<GameDifficulty>(this.difficulty);
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

    this.board[x][y] = value;
  }

  async setNewBoard(difficulty: GameDifficulty) {
    const { board } = await firstValueFrom(this.apiSudoku.getBoard(difficulty));
    this.board = board;
    this.board$.next(board);
    this.difficulty = difficulty;
    this.difficulty$.next(this.difficulty);
    this.status = 'unsolved';
    this.status$.next(this.status);
  }

  async solveBoard() {
    const { solution, status, difficulty } = await firstValueFrom(
      this.apiSudoku.solveBoard({ board: this.board })
    );
    this.board = solution;
    this.board$.next(this.board);
    this.difficulty = difficulty;
    this.difficulty$.next(this.difficulty);
    this.status = status;
    this.status$.next(this.status);
  }

  async validateBoard() {
    const { status } = await firstValueFrom(
      this.apiSudoku.validateBoard({ board: this.board })
    );
    this.status = status;
    console.log(this.board);
    console.log('VALIDATING..', status);
    this.status$.next(this.status);
  }
}
