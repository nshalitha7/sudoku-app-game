import {
  CellType,
  GameDifficultySchema,
  GameStatusSchema,
} from './sudoku.type';

import { z } from 'zod';

export const UpdateBoardMessageSchema = z.object({
  x: z.number().min(0).max(8),
  y: z.number().min(0).max(8),
  value: z.number().min(0).max(9),
});
export type UpdateBoardMessage = z.infer<typeof UpdateBoardMessageSchema>;

export const UpdateBoardStatusSchema = z.object({
  status: GameStatusSchema,
});
export type UpdateBoardStatus = z.infer<typeof UpdateBoardStatusSchema>;

export const BoardInformationSchema = z.object({
  board: z.array(
    z.array(
      z.object({
        value: z.number().min(0).max(9),
        type: z.nativeEnum(CellType),
      })
    )
  ),
  status: GameStatusSchema,
  difficulty: GameDifficultySchema,
});
export type BoardInformation = z.infer<typeof BoardInformationSchema>;
