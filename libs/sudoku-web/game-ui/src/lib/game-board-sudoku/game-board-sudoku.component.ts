import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { SudokuLogic } from '@sudoku-app-game/sudoku-logic';
import { GameStatus, GameDifficulty } from '@sudoku-app-game/sudoku-models';
import { BadgeComponent } from '../theme-badge/sudoku-badge.component';
import { ButtonComponent } from '../button/button.component';

type SelectedCell = {
  colIdx: number;
  rowIdx: number;
  element: HTMLElement;
};

type BoardCell = {
  value: number;
  hasDefaultValue: boolean;
};

@Component({
  selector: 'lib-game-board-sudoku',
  standalone: true,
  imports: [CommonModule, BadgeComponent, ButtonComponent],
  templateUrl: './game-board-sudoku.component.html',
  styleUrl: './game-board-sudoku.component.css',
})
export class GameBoardSudokuComponent {
  board: BoardCell[][] = [];
  selectedCell: SelectedCell | null;
  status: GameStatus;
  difficulty: GameDifficulty;
  possibleKey = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  constructor(private sudokuLogic: SudokuLogic) {
    this.sudokuLogic.board$.subscribe((board) => {
      this.board = board.map((col) =>
        col.map(
          (row): BoardCell => ({ value: row, hasDefaultValue: row !== 0 })
        )
      );
    });
    this.sudokuLogic.difficulty$.subscribe(
      (difficulty) => (this.difficulty = difficulty)
    );
    this.sudokuLogic.status$.subscribe((status) => (this.status = status));
    this.selectedCell = null;
    this.sudokuLogic.setNewBoard('easy');
    this.status = 'unsolved';
    this.difficulty = 'random';
  }

  onClickGenerate(difficulty: GameDifficulty) {
    this.sudokuLogic.setNewBoard(difficulty);
  }

  onClickValidate() {
    console.log('OnClickValide');
    this.sudokuLogic.validateBoard();
  }

  onCickSolve() {
    this.sudokuLogic.solveBoard();
  }

  onClickBoard($event: Event) {
    console.log('Clicked');
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

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.setNewValueToSelectedCell(event.key);
  }

  setNewValueToSelectedCell(key: string) {
    if (
      !this.selectedCell ||
      this.board[this.selectedCell.colIdx][this.selectedCell.rowIdx]
        .hasDefaultValue
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
    if (key === '0') {
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
}
