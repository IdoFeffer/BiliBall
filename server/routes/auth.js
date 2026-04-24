const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { db } = require('../database')

const SECRET = 'biliball_secret_key'

router.post('/register', async (req, res) => {
  const { username, password, full_name } = req.body

  if (!username || !password || !full_name) {
    return res.status(400).json({ error: 'כל השדות נדרשים' })
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const result = await db.execute({
      sql: 'INSERT INTO users (username, password, full_name) VALUES (?, ?, ?)',
      args: [username, hashedPassword, full_name]
    })

    const token = jwt.sign({ id: Number(result.lastInsertRowid), username }, SECRET)
    res.json({ token, user: { id: Number(result.lastInsertRowid), username, full_name } })
  } catch (err) {
    res.status(400).json({ error: 'שם המשתמש כבר קיים' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body

    const result = await db.execute({
      sql: 'SELECT * FROM users WHERE username = ?',
      args: [username]
    })
    const user = result.rows[0]
    if (!user) return res.status(401).json({ error: 'שם משתמש או סיסמה שגויים' })

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return res.status(401).json({ error: 'שם משתמש או סיסמה שגויים' })

    const token = jwt.sign({ id: Number(user.id), username: user.username }, SECRET)
    res.json({ token, user: { id: Number(user.id), username: user.username, full_name: user.full_name } })
  } catch (err) {
    res.status(500).json({ error: 'שגיאה בשרת' })
  }
})

module.exports = router