import { Socket, io } from 'socket.io-client';
import {
  UpdateBoardMessage,
  UpdateBoardStatus,
  BoardInformation,
} from '@sudoku-app-game/sudoku-models';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SudokuMultiplayer {
  private socket: Socket | null = null;
  multiplayerBoard$ = new BehaviorSubject<BoardInformation | null>(null);
  newValue$ = new BehaviorSubject<UpdateBoardMessage | null>(null);
  newStatus$ = new BehaviorSubject<UpdateBoardStatus | null>(null);

  constructor() {
    return;
  }

  public init(gameId: string, board: BoardInformation) {
    this.socket = io('http://localhost:3333', { query: { gameId } });
    this.socket.on('connect', () => {
      this.emitBoardInit(board);
    });

    this.socket.on('init-board', (board: BoardInformation) => {
      this.multiplayerBoard$.next(board);
    });

    this.socket.on('new-board', (board: BoardInformation) => {
      this.multiplayerBoard$.next(board);
    });

    this.socket.on('update-board', (msg: UpdateBoardMessage) => {
      this.newValue$.next(msg);
    });

    this.socket.on('update-status', (msg: UpdateBoardStatus) => {
      this.newStatus$.next(msg);
    });
  }

  isConnected() {
    return this.socket?.connected;
  }

  emitUpdateBoard(msg: UpdateBoardMessage) {
    if (!this.socket) return;
    this.socket.emit('update-board', msg);
  }

  emitBoardInit(board: BoardInformation) {
    if (!this.socket) return;
    this.socket.emit('init-board', board);
  }

  emitNewBoard(board: BoardInformation) {
    if (!this.socket) return;
    this.socket.emit('new-board', board);
  }

  emitNewStatus(msg: UpdateBoardStatus) {
    if (!this.socket) return;
    this.socket.emit('update-status', msg);
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }
}
