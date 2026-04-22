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

  const players = db
    .prepare(
      `
      SELECT 
        u.id,
        u.username,
        u.full_name,
        lm.role,
        COALESCE(SUM(CASE WHEN g.winner_id = u.id THEN g.winner_score ELSE 0 END), 0) +
        COALESCE(SUM(CASE WHEN g.loser_id = u.id THEN g.loser_score ELSE 0 END), 0) as wins,
        COALESCE(SUM(CASE WHEN g.winner_id = u.id THEN g.loser_score ELSE 0 END), 0) +
        COALESCE(SUM(CASE WHEN g.loser_id = u.id THEN g.winner_score ELSE 0 END), 0) as losses
      FROM league_members lm
      JOIN users u ON u.id = lm.user_id
      LEFT JOIN games g ON (g.winner_id = u.id OR g.loser_id = u.id)
        AND g.league_id = ?
        AND g.status = 'confirmed'
      WHERE lm.league_id = ?
      GROUP BY u.id
      ORDER BY wins - losses DESC
    `,
    )
    .all(league_id, league_id)

  res.json(players)
})

router.get('/:user_id/stats/:league_id', auth, (req, res) => {
  const { user_id, league_id } = req.params

  const user = db
    .prepare('SELECT id, username, full_name FROM users WHERE id = ?')
    .get(user_id)
  if (!user) return res.status(404).json({ error: 'משתמש לא נמצא' })

  const winsRes = db
    .prepare(
      `
      SELECT 
        COALESCE(SUM(CASE WHEN winner_id = ? THEN winner_score ELSE loser_score END), 0) as count
      FROM games 
      WHERE (winner_id = ? OR loser_id = ?) AND league_id = ? AND status = 'confirmed'
    `,
    )
    .get(user_id, user_id, user_id, league_id)
  const wins = winsRes.count

  const lossesRes = db
    .prepare(
      `
      SELECT 
        COALESCE(SUM(CASE WHEN loser_id = ? THEN winner_score ELSE loser_score END), 0) as count
      FROM games 
      WHERE (winner_id = ? OR loser_id = ?) AND league_id = ? AND status = 'confirmed'
    `,
    )
    .get(user_id, user_id, user_id, league_id)
  const losses = lossesRes.count

  const games = db
    .prepare(
      `
      SELECT 
        g.id,
        g.played_at,
        g.note,
        g.winner_score,
        g.loser_score,
        CASE WHEN g.winner_id = ? THEN 'win' ELSE 'lose' END as result,
        CASE WHEN g.winner_id = ? THEN l.full_name ELSE w.full_name END as opponent_name,
        CASE WHEN g.winner_id = ? THEN l.id ELSE w.id END as opponent_id
      FROM games g
      JOIN users w ON w.id = g.winner_id
      JOIN users l ON l.id = g.loser_id
      WHERE (g.winner_id = ? OR g.loser_id = ?) AND g.league_id = ? AND g.status = 'confirmed'
      ORDER BY g.played_at DESC
    `,
    )
    .all(user_id, user_id, user_id, user_id, user_id, league_id)

  const rivals = db
    .prepare(
      `
      SELECT 
        CASE WHEN g.winner_id = ? THEN l.id ELSE w.id END as opponent_id,
        CASE WHEN g.winner_id = ? THEN l.full_name ELSE w.full_name END as opponent_name,
        COUNT(*) as total,
        COALESCE(SUM(CASE WHEN g.winner_id = ? THEN g.winner_score ELSE g.loser_score END), 0) as wins
      FROM games g
      JOIN users w ON w.id = g.winner_id
      JOIN users l ON l.id = g.loser_id
      WHERE (g.winner_id = ? OR g.loser_id = ?) AND g.league_id = ? AND g.status = 'confirmed'
      GROUP BY opponent_id
    `,
    )
    .all(user_id, user_id, user_id, user_id, user_id, league_id)

  res.json({ user, wins, losses, games, rivals })
})

router.get('/h2h/:user1_id/:user2_id/:league_id', auth, (req, res) => {
  const { user1_id, user2_id, league_id } = req.params

  const games = db
    .prepare(
      `
      SELECT 
        g.id,
        g.played_at,
        g.winner_id,
        g.loser_id,
        g.winner_score,
        g.loser_score,
        w.full_name as winner_name,
        l.full_name as loser_name
      FROM games g
      JOIN users w ON w.id = g.winner_id
      JOIN users l ON l.id = g.loser_id
      WHERE g.league_id = ?
      AND ((g.winner_id = ? AND g.loser_id = ?) OR (g.winner_id = ? AND g.loser_id = ?))
      AND g.status = 'confirmed'
      ORDER BY g.played_at DESC
    `,
    )
    .all(league_id, user1_id, user2_id, user2_id, user1_id)

  const user1Wins = games.reduce(
    (sum, g) =>
      sum + (g.winner_id == user1_id ? g.winner_score : g.loser_score),
    0,
  )
  const user2Wins = games.reduce(
    (sum, g) =>
      sum + (g.winner_id == user2_id ? g.winner_score : g.loser_score),
    0,
  )

  res.json({ games, user1Wins, user2Wins, total: games.length })
})

router.delete('/:id', auth, (req, res) => {
  if (parseInt(req.params.id) !== req.user.id) {
    return res.status(403).json({ error: 'לא מורשה למחוק משתמש זה' })
  }
  db.prepare('DELETE FROM league_members WHERE user_id = ?').run(req.user.id)
  db.prepare('DELETE FROM games WHERE winner_id = ? OR loser_id = ?').run(
    req.user.id,
    req.user.id,
  )
  db.prepare('DELETE FROM users WHERE id = ?').run(req.user.id)
  res.json({ success: true })
})

module.exports = router
