import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GameBoardSudokuComponent } from '@sudoku-app-game/game-board-sudoku';

@Component({
  standalone: true,
  imports: [GameBoardSudokuComponent, RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'sudoku-app-game';
}
