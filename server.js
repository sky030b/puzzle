const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { mongoose, Move, Room } = require('./db');
const bodyParser = require('body-parser');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  socket.on('joinRoom', (room) => {
    socket.join(room);
  });

  socket.on('movePiece', async (data) => {
    const move = new Move({
      roomId: data.room,
      pieceId: data.id,
      userId: socket.id,  // Use socket.id as user ID
      moveEvents: [{ x: parseInt(data.left), y: parseInt(data.top), timestamp: new Date() }]
    });
    await move.save();
    socket.to(data.room).emit('movePiece', data);
  });

  socket.on('lockPiece', async (data) => {
    await Move.updateOne(
      { roomId: data.room, pieceId: data.id },
      { $set: { 'moveEvents.$[].locked': true } }
    );
    socket.to(data.room).emit('lockPiece', data);
  });
});

app.get('/generate-timelapse/:room', async (req, res) => {
  const { room } = req.params;
  
  console.log(123, room)
  const moves = await Move.find({ roomId: room }).sort('moveEvents.timestamp');
  console.log(123, moves)
  const frames = [];
  for (const move of moves) {
    for (const event of move.moveEvents) {
      frames.push(event);
    }
  }

  const videoPath = `./videos/${room}.mp4`;
  const tempDir = `./temp/${room}`;

  if (!fs.existsSync(tempDir)){
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const frameRenderingPromises = frames.map((frame, index) => {
    return new Promise((resolve) => {
      const canvas = createCanvas(400, 400);
      const ctx = canvas.getContext('2d');
      // Load and draw the background image
      loadImage('path/to/your/image.png').then(image => {
        ctx.drawImage(image, 0, 0, 400, 400);

        // Draw the puzzle piece at its position
        ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
        ctx.fillRect(frame.x, frame.y, 50, 50); // Adjust size and color as needed

        const filePath = `${tempDir}/frame-${index}.png`;
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(filePath, buffer);
        resolve();
      });
    });
  });

  await Promise.all(frameRenderingPromises);

  ffmpeg()
    .addInput(`${tempDir}/frame-%d.png`)
    .inputOptions('-framerate 30')
    .outputOptions('-pix_fmt yuv420p')
    .save(videoPath)
    .on('end', () => {
      res.download(videoPath, () => {
        fs.rmdirSync(tempDir, { recursive: true });
        fs.unlinkSync(videoPath);
      });
    });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
