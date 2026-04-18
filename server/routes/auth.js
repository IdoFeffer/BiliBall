const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const db = require('../database')

const SECRET = 'biliball_secret_key'

router.post('/register', async (req, res) => {
  const { username, password, full_name } = req.body

  if (!username || !password || !full_name) {
    return res.status(400).json({ error: 'כל השדות נדרשים' })
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const stmt = db.prepare('INSERT INTO users (username, password, full_name) VALUES (?, ?, ?)')
    const result = stmt.run(username, hashedPassword, full_name)

    const token = jwt.sign({ id: result.lastInsertRowid, username }, SECRET)
    res.json({ token, user: { id: result.lastInsertRowid, username, full_name } })
  } catch (err) {
    res.status(400).json({ error: 'שם המשתמש כבר קיים' })
  }
})

router.post('/login', async (req, res) => {
  const { username, password } = req.body

  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username)
  if (!user) return res.status(401).json({ error: 'שם משתמש או סיסמה שגויים' })

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) return res.status(401).json({ error: 'שם משתמש או סיסמה שגויים' })

  const token = jwt.sign({ id: user.id, username: user.username }, SECRET)
  res.json({ token, user: { id: user.id, username: user.username, full_name: user.full_name } })
})

module.exports = router