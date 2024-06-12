const express = require('express');
const router = express.Router();
const Room = require('../models/Room');

// GET 請求：獲取所有房間
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST 請求：創建新的房間
router.post('/', async (req, res) => {
  const room = new Room({
    // 這裡從 req.body 讀取數據
    roomId: req.body.roomId,
    ownerId: req.body.ownerId,
    isPublic: req.body.isPublic,
    img: req.body.img,
    piecesBy: req.body.piecesBy,
    lockedPieces: req.body.lockedPieces
  });

  try {
    const newRoom = await room.save();
    res.status(201).json(newRoom);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
