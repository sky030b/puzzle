// const mongoose = require('mongoose');
// const dotenv = require("dotenv");
// dotenv.config();

// const uri = process.env.MONGODB_URI;

// mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.error('MongoDB connection error:', err));

// const moveSchema = new mongoose.Schema({
//   roomId: { type: Number, required: true },
//   pieceId: { type: Number, required: true },
//   userId: { type: String, required: true },
//   moveEvents: [{
//     x: { type: Number, required: true },
//     y: { type: Number, required: true },
//     timestamp: { type: Date, required: true }
//   }]
// });

// const roomSchema = new mongoose.Schema({
//   roomId: { type: Number, required: true, unique: true },
//   isPublic: { type: Boolean, default: false },
//   img: { type: String, required: true },
//   piecesBy: { type: [Number], required: true },
//   lockedPieces: [{
//     pieceId: { type: Number, required: true },
//     lockedBy: { type: String, required: true },
//     lockedAt: { type: Date, default: Date.now }
//   }]
// });

// const Move = mongoose.model('Move', moveSchema);
// const Room = mongoose.model('Room', roomSchema);

// module.exports = { Move, Room };


const mongoose = require('mongoose');

const dotenv = require("dotenv");
dotenv.config();

const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));
