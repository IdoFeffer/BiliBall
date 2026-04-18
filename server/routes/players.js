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

router.get('/league/:league_id', auth, (req, res) => {
  const { league_id } = req.params

  const players = db.prepare(`
    SELECT 
      u.id,
      u.username,
      u.full_name,
      lm.role,
      COUNT(CASE WHEN g.winner_id = u.id THEN 1 END) as wins,
      COUNT(CASE WHEN g.loser_id = u.id THEN 1 END) as losses
    FROM league_members lm
    JOIN users u ON u.id = lm.user_id
    LEFT JOIN games g ON (g.winner_id = u.id OR g.loser_id = u.id) AND g.league_id = ?
    WHERE lm.league_id = ?
    GROUP BY u.id
    ORDER BY wins - losses DESC
  `).all(league_id, league_id)

  res.json(players)
})

router.get('/:user_id/stats/:league_id', auth, (req, res) => {
  const { user_id, league_id } = req.params

  const user = db.prepare('SELECT id, username, full_name FROM users WHERE id = ?').get(user_id)
  if (!user) return res.status(404).json({ error: 'משתמש לא נמצא' })

  const wins = db.prepare('SELECT COUNT(*) as count FROM games WHERE winner_id = ? AND league_id = ?')
    .get(user_id, league_id).count

  const losses = db.prepare('SELECT COUNT(*) as count FROM games WHERE loser_id = ? AND league_id = ?')
    .get(user_id, league_id).count

  const games = db.prepare(`
    SELECT 
      g.id,
      g.played_at,
      g.note,
      CASE WHEN g.winner_id = ? THEN 'win' ELSE 'lose' END as result,
      CASE WHEN g.winner_id = ? THEN l.full_name ELSE w.full_name END as opponent_name,
      CASE WHEN g.winner_id = ? THEN l.id ELSE w.id END as opponent_id
    FROM games g
    JOIN users w ON w.id = g.winner_id
    JOIN users l ON l.id = g.loser_id
    WHERE (g.winner_id = ? OR g.loser_id = ?) AND g.league_id = ?
    ORDER BY g.played_at DESC
  `).all(user_id, user_id, user_id, user_id, user_id, league_id)

  const rivals = db.prepare(`
    SELECT 
      CASE WHEN g.winner_id = ? THEN l.id ELSE w.id END as opponent_id,
      CASE WHEN g.winner_id = ? THEN l.full_name ELSE w.full_name END as opponent_name,
      COUNT(*) as total,
      COUNT(CASE WHEN g.winner_id = ? THEN 1 END) as wins
    FROM games g
    JOIN users w ON w.id = g.winner_id
    JOIN users l ON l.id = g.loser_id
    WHERE (g.winner_id = ? OR g.loser_id = ?) AND g.league_id = ?
    GROUP BY opponent_id
  `).all(user_id, user_id, user_id, user_id, user_id, league_id)

  res.json({ user, wins, losses, games, rivals })
})

router.get('/h2h/:user1_id/:user2_id/:league_id', auth, (req, res) => {
  const { user1_id, user2_id, league_id } = req.params

  const games = db.prepare(`
    SELECT 
      g.id,
      g.played_at,
      g.winner_id,
      g.loser_id,
      w.full_name as winner_name,
      l.full_name as loser_name
    FROM games g
    JOIN users w ON w.id = g.winner_id
    JOIN users l ON l.id = g.loser_id
    WHERE g.league_id = ?
    AND ((g.winner_id = ? AND g.loser_id = ?) OR (g.winner_id = ? AND g.loser_id = ?))
    ORDER BY g.played_at DESC
  `).all(league_id, user1_id, user2_id, user2_id, user1_id)

  const user1Wins = games.filter(g => g.winner_id == user1_id).length
  const user2Wins = games.filter(g => g.winner_id == user2_id).length

  res.json({ games, user1Wins, user2Wins, total: games.length })
})

module.exports = router