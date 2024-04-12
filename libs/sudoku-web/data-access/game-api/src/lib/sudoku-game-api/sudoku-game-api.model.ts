import { GameDifficulty, GameStatus } from '@sudoku-app-game/sudoku-models';

export type SudokuBoardStatusResult = {
  status: GameStatus;
};

export type SudokuBoard = {
  board: number[][];
};

export type SudokuBoardSolved = {
  solution: number[][];
  difficulty: GameDifficulty;
  status: GameStatus;
};
