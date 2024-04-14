import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { SudokuLogic } from '@sudoku-app-game/sudoku-logic';
import {
  GameStatus,
  GameDifficulty,
  CellType,
  SudokuCell,
} from '@sudoku-app-game/sudoku-models';
import { BadgeComponent } from '../theme-badge/sudoku-badge.component';
import { ButtonComponent } from '../button/button.component';
import { FormsModule } from '@angular/forms';

type SelectedCell = {
  colIdx: number;
  rowIdx: number;
  element: HTMLElement;
};

@Component({
  selector: 'lib-game-board-sudoku',
  standalone: true,
  imports: [CommonModule, BadgeComponent, ButtonComponent, FormsModule],
  templateUrl: './game-board-sudoku.component.html',
  styleUrl: './game-board-sudoku.component.css',
})
export class GameBoardSudokuComponent {
  CellType = CellType;

  board: SudokuCell[][] = [];
  selectedCell: SelectedCell | null;
  status: GameStatus;
  difficulty: GameDifficulty;
  isLoading: boolean;
  gameId: string;
  possibleKey = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  constructor(private sudokuLogic: SudokuLogic) {
    this.sudokuLogic.board$.subscribe((board) => {
      this.board = board;
    });
    this.sudokuLogic.difficulty$.subscribe(
      (difficulty) => (this.difficulty = difficulty)
    );
    this.sudokuLogic.status$.subscribe((status) => (this.status = status));
    this.selectedCell = null;
    this.sudokuLogic.setNewBoard('easy');
    this.status = 'unsolved';
    this.difficulty = 'random';
    this.isLoading = false;
    this.gameId = '';
  }

  async onClickGenerate(difficulty: GameDifficulty) {
    this.isLoading = true;
    await this.sudokuLogic.setNewBoard(difficulty);
    this.isLoading = false;
  }

  async onClickValidate() {
    this.isLoading = true;
    await this.sudokuLogic.validateBoard();
    this.isLoading = false;
  }

  async onClickSolve() {
    this.isLoading = true;
    await this.sudokuLogic.solveBoard();
    this.isLoading = false;
  }

  onClickBoard($event: Event) {
    const srcElement = $event.target as HTMLElement;
    if (!srcElement) return;
    if (!srcElement.classList.contains('square')) return;

    if (this.selectedCell) {
      this.selectedCell.element.classList.remove('selected');
    }

    this.selectedCell = {
      element: srcElement,
      rowIdx: 0,
      colIdx: 0,
    };
    this.selectedCell.element.classList.add('selected');
    srcElement.classList.forEach((className: string) => {
      if (!this.selectedCell) return;
      if (className.startsWith('col')) {
        this.selectedCell.colIdx = +className.charAt(3);
      }
      if (className.startsWith('row')) {
        this.selectedCell.rowIdx = +className.charAt(3);
      }
    });

    return;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.setNewValueToSelectedCell(event.key);
  }

  setNewValueToSelectedCell(key: string) {
    if (this.isLoading) return;
    if (
      !this.selectedCell ||
      this.board[this.selectedCell.colIdx][this.selectedCell.rowIdx].type ===
        CellType.FIXED ||
      this.board[this.selectedCell.colIdx][this.selectedCell.rowIdx].type ===
        CellType.GENERATED
    )
      return;
    if (this.possibleKey.includes(key)) {
      this.board[this.selectedCell.colIdx][this.selectedCell.rowIdx].value =
        +key;
      this.sudokuLogic.setValue(
        this.selectedCell.colIdx,
        this.selectedCell.rowIdx,
        +key
      );
      this.selectedCell.element.classList.add('selected');
    }
    if (
      key === '0' ||
      key === 'Delete' ||
      key === 'Backspace' ||
      this.status == 'unsolvable'
    ) {
      this.board[this.selectedCell.colIdx][this.selectedCell.rowIdx].value = 0;
      this.sudokuLogic.setValue(
        this.selectedCell.colIdx,
        this.selectedCell.rowIdx,
        0
      );
      this.selectedCell.element.classList.remove('selected');
      this.selectedCell = null;
    }
  }

  onClickLogin() {
    this.sudokuLogic.initMultiplayer(this.gameId);
  }
}
