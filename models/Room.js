const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomId: Number,
  ownerId: Number,
  isPublic: Boolean,
  img: String,
  piecesBy: [Number],
  lockedPieces: [{
    pieceId: Number,
    lockBy: String,
    lockWhen: Date
  }]
});

module.exports = mongoose.model('Room', roomSchema);
