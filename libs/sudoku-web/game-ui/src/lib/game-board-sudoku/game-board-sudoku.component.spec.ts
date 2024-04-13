import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameBoardSudokuComponent } from './game-board-sudoku.component';

describe('GameBoardSudokuComponent', () => {
  let component: GameBoardSudokuComponent;
  let fixture: ComponentFixture<GameBoardSudokuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameBoardSudokuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GameBoardSudokuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
