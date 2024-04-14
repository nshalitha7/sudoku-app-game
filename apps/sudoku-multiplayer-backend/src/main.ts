import { Server } from 'socket.io';
import express from 'express';
import * as path from 'path';
import {
  SudokuCell,
  UpdateBoardStatus,
  UpdateBoardMessage,
} from '@sudoku-app-game/sudoku-models';

const app = express();

export type GameRoom = {
  gameId: string;
  board: SudokuCell[][];
};

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to sudoku-multiplayer-backend!' });
});

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);

const io = new Server({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
  maxHttpBufferSize: 1e8,
}).listen(server);

const rooms: {
  [key: string]: GameRoom;
} = {};

io.on('connection', async (socket) => {
  console.log('New player logged in');
  const gameId: string = (socket.request as any)._query['gameId'];
  await socket.join(gameId);

  socket.on('init-board', (board: SudokuCell[][]) => {
    if (rooms[gameId] == null) {
      rooms[gameId] = {
        gameId,
        board,
      };
    }
    io.to(gameId).emit('init-board', rooms[gameId].board);
  });

  socket.on('new-board', (board: SudokuCell[][]) => {
    if (!rooms[gameId]) {
      rooms[gameId] = {
        gameId,
        board,
      };
    }
    io.to(gameId).emit('new-board', board);
  });

  socket.on('update-board', (msg: UpdateBoardMessage) => {
    io.to(gameId).emit('update-board', msg);
  });

  socket.on('update-status', (msg: UpdateBoardStatus) => {
    io.to(gameId).emit('update-status', msg);
  });
});
