const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { run, get } = require('../db');
const { jwtSecret } = require('../middleware/auth');

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existing = await get('SELECT id FROM users WHERE email = ?', [normalizedEmail]);
  if (existing) {
    return res.status(409).json({ error: 'User already exists' });
  }

  const userCount = await get('SELECT COUNT(*) AS count FROM users');
  const assignedRole = userCount?.count === 0 ? 'admin' : 'member';
  const hashed = await bcrypt.hash(password, 10);
  const createdAt = new Date().toISOString();
  const user = await run(
    'INSERT INTO users (name, email, password, role, createdAt) VALUES (?, ?, ?, ?, ?)',
    [name.trim(), normalizedEmail, hashed, assignedRole, createdAt]
  );

  const payload = { id: user.lastID };
  const token = jwt.sign(payload, jwtSecret, { expiresIn: '8h' });
  res.json({ token, user: { id: user.lastID, name, email: normalizedEmail, role: assignedRole } });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = await get('SELECT id, name, email, password, role FROM users WHERE email = ?', [email.toLowerCase().trim()]);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const payload = { id: user.id };
  const token = jwt.sign(payload, jwtSecret, { expiresIn: '8h' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

module.exports = router;
