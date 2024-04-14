import { Socket, io } from 'socket.io-client';

import { BehaviorSubject } from 'rxjs';
import { SudokuCell } from '@sudoku-app-game/sudoku-models';
import { Injectable } from '@angular/core';

export type UpdateBoardMessage = {
  x: number;
  y: number;
  value: number;
};

@Injectable({ providedIn: 'root' })
export class SudokuMultiplayer {
  private socket: Socket | null = null;
  initBoard$ = new BehaviorSubject<SudokuCell[][] | null>(null);

  constructor() {
    return;
  }

  public init(gameId: string, board: SudokuCell[][]) {
    this.socket = io('http://localhost:3333', { query: { gameId } });
    this.socket.on('connect', () => {
      this.emitBoardInit(board);
    });

    this.socket.on('init-board', (board: SudokuCell[][]) => {
      this.initBoard$.next(board);
    });
  }

  isConnected() {
    return this.socket?.connected;
  }

  emitUpdateBoard(msg: UpdateBoardMessage) {
    if (!this.socket) return;
    this.socket.emit('update-board', msg);
  }

  emitBoardInit(board: SudokuCell[][]) {
    if (!this.socket) return;
    this.socket.emit('init-board', board);
  }

  emitNewBoard(board: SudokuCell[][]) {
    if (!this.socket) return;
    this.socket.emit('new-board', board);
  }
}
