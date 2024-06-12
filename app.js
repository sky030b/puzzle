const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
require('./db');  // 這將連線到 MongoDB
const Room = require('./models/Room'); // 引入 Room 模型

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// 提供靜態檔案
app.use(express.static('public'));
app.use(express.json());  // 用於解析 JSON 請求體

// 當有用戶連接時
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('movePiece', (data) => {
    socket.broadcast.emit('movePiece', data);
  });

  socket.on('lockPiece', async (data) => {
    socket.broadcast.emit('lockPiece', data);

    try {
      const room = await Room.findOneAndUpdate(
        { roomId: data.room },
        {
          $push: {
            lockedPieces: {
              pieceId: +(data.id.replace("piece", '')),
              lockBy: socket.id,
              lockWhen: new Date()  // 或使用 data.lockWhen 如果前端發送了時間戳
            }
          }
        },
        { new: true, upsert: true }  // 如果不存在則創建新的文檔
      );
    } catch (err) {
      console.error('Error updating room:', err);
    }
  });


  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
