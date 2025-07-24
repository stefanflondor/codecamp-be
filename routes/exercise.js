const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

const users = [];
const exercises = {};  // key: user ID, value: array of exercises

// POST /api/users
router.post('/users', (req, res) => {
  const username = req.body.username;
  const _id = uuidv4();
  const user = { username, _id };
  users.push(user);
  exercises[_id] = [];
  res.json(user);
});

// GET /api/users
router.get('/users', (req, res) => {
  res.json(users);
});

// POST /api/users/:_id/exercises
router.post('/users/:_id/exercises', (req, res) => {
  const user = users.find(u => u._id === req.params._id);
  if (!user) return res.status(400).json({ error: 'User not found' });

  const { description, duration, date } = req.body;
  const log = {
    description,
    duration: parseInt(duration),
    date: date ? new Date(date).toDateString() : new Date().toDateString()
  };
  exercises[user._id].push(log);

  res.json({
    username: user.username,
    _id: user._id,
    ...log
  });
});

// GET /api/users/:_id/logs
router.get('/users/:_id/logs', (req, res) => {
  const user = users.find(u => u._id === req.params._id);
  if (!user) return res.status(400).json({ error: 'User not found' });

  let log = exercises[user._id] || [];

  // Optional filters
  const { from, to, limit } = req.query;

  if (from) {
    const fromDate = new Date(from);
    log = log.filter(entry => new Date(entry.date) >= fromDate);
  }

  if (to) {
    const toDate = new Date(to);
    log = log.filter(entry => new Date(entry.date) <= toDate);
  }

  if (limit) {
    log = log.slice(0, parseInt(limit));
  }

  res.json({
    username: user.username,
    count: log.length,
    _id: user._id,
    log
  });
});

module.exports = router;
