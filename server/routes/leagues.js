const express = require('express')
const router = express.Router()
const db = require('../database')
const jwt = require('jsonwebtoken')

const SECRET = 'biliball_secret_key'

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'לא מורשה' })
  try {
    req.user = jwt.verify(token, SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'טוקן לא תקין' })
  }
}

const generateCode = () => Math.random().toString(36).substring(2, 8).toUpperCase()

router.post('/create', auth, (req, res) => {
  const { name } = req.body
  if (!name) return res.status(400).json({ error: 'שם הליגה נדרש' })

  const invite_code = generateCode()
  const stmt = db.prepare('INSERT INTO leagues (name, invite_code, created_by) VALUES (?, ?, ?)')
  const result = stmt.run(name, invite_code, req.user.id)

  db.prepare('INSERT INTO league_members (league_id, user_id, role) VALUES (?, ?, ?)')
    .run(result.lastInsertRowid, req.user.id, 'admin')

  const league = db.prepare('SELECT * FROM leagues WHERE id = ?').get(result.lastInsertRowid)
  res.json(league)
})

router.post('/join', auth, (req, res) => {
  const { invite_code } = req.body
  const league = db.prepare('SELECT * FROM leagues WHERE invite_code = ?').get(invite_code)
  if (!league) return res.status(404).json({ error: 'ליגה לא נמצאה' })

  const existing = db.prepare('SELECT * FROM league_members WHERE league_id = ? AND user_id = ?')
    .get(league.id, req.user.id)
  if (existing) return res.status(400).json({ error: 'כבר חבר בליגה' })

  db.prepare('INSERT INTO league_members (league_id, user_id, role) VALUES (?, ?, ?)')
    .run(league.id, req.user.id, 'member')

  res.json(league)
})

router.get('/:id/members', auth, (req, res) => {
  const members = db.prepare(`
    SELECT u.id, u.username, u.full_name, lm.role
    FROM league_members lm
    JOIN users u ON u.id = lm.user_id
    WHERE lm.league_id = ?
  `).all(req.params.id)

  res.json(members)
})

module.exports = router