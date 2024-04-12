import { SudokuBoard, SudokuBoardSolved, SudokuBoardStatusResult } from "./sudoku-game-api.model";
import { GameDifficulty } from '@sudoku-app-game/sudoku-models';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class GameApiSudoku {
  private readonly baseUrl: string = "https://sugoku.onrender.com/";
  private readonly headersOverride = {
    'Content-Type': 'application/x-www-form-urlencoded'
  };

  constructor(private readonly http: HttpClient) {
  }

  public getBoard(difficulty: GameDifficulty): Observable<SudokuBoard> {
    return this.http.get<SudokuBoard>(`${this.baseUrl}/board`, { params: { difficulty } })
  }

  public solveBoard(board: SudokuBoard): Observable<SudokuBoardSolved> {
    return this.http.post<SudokuBoardSolved>(`${this.baseUrl}/solve`, board, {
      headers: this.headersOverride
    });
  }

  public validateBoard(board: SudokuBoard): Observable<SudokuBoardStatusResult> {
    return this.http.post<SudokuBoardStatusResult>(`${this.baseUrl}/validate`, board, {
      headers: this.headersOverride
    });
  }

}
