import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { SudokuLogic } from '@sudoku-app-game/sudoku-logic';

type SelectedCell = {
  colIdx: number;
  rowIdx: number;
  element: HTMLElement;
};
@Component({
  selector: 'lib-game-board-sudoku',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-board-sudoku.component.html',
  styleUrl: './game-board-sudoku.component.css',
})
export class GameBoardSudokuComponent {
  board: number[][] = [];
  selectedCell: SelectedCell | null;

  constructor(private sudokuLogic: SudokuLogic) {
    this.board = this.sudokuLogic.board;
    this.selectedCell = null;
  }

  onClickBoard($event: Event) {
    console.log('Clicked');
    const srcElement = $event.target as HTMLElement;
    if (!srcElement) return;
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
    if (!this.selectedCell) return;
    const keyToListen = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    if (keyToListen.includes(event.key)) {
      this.board[this.selectedCell.colIdx][this.selectedCell.rowIdx] =
        +event.key;
      this.selectedCell.element.classList.add('selected');
    }
    if (event.key === '0') {
      console.log('Hello!');
      this.selectedCell.element.classList.remove('selected');
      this.selectedCell = null;
    }
  }
}
