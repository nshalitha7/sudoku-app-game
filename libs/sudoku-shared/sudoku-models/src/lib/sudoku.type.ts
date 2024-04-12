import { z } from "zod";

export enum CellType {
  INPUT,
  GENERATED,
  FIXED,
}

export type SudokuCell = {
  value: number;
  type: CellType;
}

export const GameDifficultySchema = z.enum(["easy", "medium", "hard", "random"]);
export type GameDifficulty = z.infer<typeof GameDifficultySchema>;

export const GameStatusSchema = z.enum(["solved", "unsolved", "broken"]);
export type GameStatus = z.infer<typeof GameStatusSchema>;


