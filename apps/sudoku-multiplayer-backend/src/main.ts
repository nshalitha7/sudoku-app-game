import { Server } from 'socket.io';
import express from 'express';
import * as path from 'path';

const app = express();

export type GameRoom = {
  gameId: string;
  board: number[][];
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

  socket.on('init-board', (msg) => {
    if (rooms[gameId] == null) {
      console.log('override gameID');
      rooms[gameId] = {
        gameId,
        board: msg.board,
      };
    }
    io.to(gameId).emit('init-board', { board: rooms[gameId] });
  });

  socket.on('new-board', (msg) => {
    if (!rooms[gameId]) {
      rooms[gameId] = {
        gameId,
        board: msg.board,
      };
    }
    io.to(gameId).emit(msg);
  });

  socket.on('update-board', (msg) => {
    console.log(msg);
    io.to(gameId).emit(msg);
  });
  socket.on('update-select', (msg) => {
    console.log(msg);
  });

  socket.on('connect_error', function (err) {
    console.log('client connect_error: ', err);
  });

  socket.on('connect_timeout', function (err) {
    console.log('client connect_timeout: ', err);
  });
});
