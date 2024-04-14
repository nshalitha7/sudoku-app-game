import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

import { GameBoardSudokuComponent } from './game-board-sudoku.component';
import { SudokuLogic } from '@sudoku-app-game/sudoku-logic';
import {
  SudokuCell,
  CellType,
  GameDifficulty,
  GameStatus,
} from '@sudoku-app-game/sudoku-models';
import { BadgeComponent } from '../theme-badge/sudoku-badge.component';
import { ButtonComponent } from '../button/button.component';

class MockBehaviorSubject<T> extends BehaviorSubject<T> {
  constructor(initialValue: T) {
    super(initialValue);
  }

  override next(value: T): void {
    super.next(value); // This will update the internal value and notify subscribers
  }
}

describe('GameBoardSudokuComponent', () => {
  let component: GameBoardSudokuComponent;
  let fixture: ComponentFixture<GameBoardSudokuComponent>;
  let sudokuLogicMock: Partial<SudokuLogic>;

  beforeEach(async () => {
    sudokuLogicMock = {
      board$: new MockBehaviorSubject<SudokuCell[][]>([
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
      ]),
      difficulty$: new MockBehaviorSubject<GameDifficulty>('easy'),
      status$: new MockBehaviorSubject<GameStatus>('unsolved'),
      setNewBoard: jest.fn(),
      validateBoard: jest.fn(),
      solveBoard: jest.fn(),
      setValue: jest.fn(),
      disconnectMultiplayer: jest.fn(),
      initMultiplayer: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        GameBoardSudokuComponent,
        BadgeComponent,
        ButtonComponent,
      ],
      providers: [{ provide: SudokuLogic, useValue: sudokuLogicMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(GameBoardSudokuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle keyboard events correctly', () => {
    const keyEvent = new KeyboardEvent('keydown', { key: '5' });
    component.selectedCell = {
      colIdx: 0,
      rowIdx: 0,
      element: document.createElement('div'),
    };
    fixture.nativeElement.dispatchEvent(keyEvent);
    component.handleKeyboardEvent(new KeyboardEvent('keydown', { key: '5' }));
    expect(sudokuLogicMock.setValue).toHaveBeenCalledWith(0, 0, 5);
  });

  it('should update board when generating new board', async () => {
    const spy = jest
      .spyOn(sudokuLogicMock, 'setNewBoard')
      .mockImplementation(() => Promise.resolve());
    await component.onClickGenerate('medium');
    expect(spy).toHaveBeenCalledWith('medium');
    expect(component.isLoading).toBe(false);
  });

  it('should validate board when requested', async () => {
    const validateSpy = jest
      .spyOn(sudokuLogicMock, 'validateBoard')
      .mockImplementation(() => Promise.resolve());
    await component.onClickValidate();
    expect(validateSpy).toHaveBeenCalled();
    expect(component.isLoading).toBe(false);
  });
});
