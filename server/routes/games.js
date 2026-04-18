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

router.post('/', auth, (req, res) => {
  const { league_id, loser_id, note } = req.body

  if (!league_id || !loser_id) {
    return res.status(400).json({ error: 'חסרים פרטים' })
  }

  if (req.user.id === loser_id) {
    return res.status(400).json({ error: 'לא יכול לשחק נגד עצמך' })
  }

  const isMember = db.prepare('SELECT * FROM league_members WHERE league_id = ? AND user_id = ?')
    .get(league_id, req.user.id)
  if (!isMember) return res.status(403).json({ error: 'לא חבר בליגה' })

  const stmt = db.prepare(`
    INSERT INTO games (league_id, winner_id, loser_id, note)
    VALUES (?, ?, ?, ?)
  `)
  const result = stmt.run(league_id, req.user.id, loser_id, note || null)

  const game = db.prepare('SELECT * FROM games WHERE id = ?').get(result.lastInsertRowid)
  res.json(game)
})

router.get('/league/:league_id', auth, (req, res) => {
  const games = db.prepare(`
    SELECT 
      g.id,
      g.note,
      g.played_at,
      w.username as winner_username,
      w.full_name as winner_name,
      l.username as loser_username,
      l.full_name as loser_name
    FROM games g
    JOIN users w ON w.id = g.winner_id
    JOIN users l ON l.id = g.loser_id
    WHERE g.league_id = ?
    ORDER BY g.played_at DESC
  `).all(req.params.league_id)

  res.json(games)
})

module.exports = router