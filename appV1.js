const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// 提供靜態檔案
app.use(express.static('public'));

// 當有用戶連接時
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('movePiece', (data) => {
    socket.broadcast.emit('movePiece', data);
  });

  socket.on('lockPiece', (data) => {
    socket.broadcast.emit('lockPiece', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
