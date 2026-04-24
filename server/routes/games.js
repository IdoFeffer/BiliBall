const express = require('express')
const router = express.Router()
const { db } = require('../database')
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

router.post('/', auth, async (req, res) => {
  const { league_id, winner_id, loser_id, note, winner_score, loser_score } = req.body
  if (parseInt(winner_id) === parseInt(loser_id))
    return res.status(400).json({ error: 'חסרים פרטים' })
  try {
    const memberRes = await db.execute({
      sql: 'SELECT * FROM league_members WHERE league_id = ? AND user_id = ?',
      args: [league_id, req.user.id]
    })
    if (!memberRes.rows[0]) return res.status(403).json({ error: 'לא חבר בליגה' })

    const isPlayerInGame = parseInt(winner_id) === req.user.id || parseInt(loser_id) === req.user.id
    if (!isPlayerInGame) return res.status(403).json({ error: 'אתה לא שחקן במשחק הזה' })

    const result = await db.execute({
      sql: `INSERT INTO games (league_id, winner_id, loser_id, note, winner_score, loser_score, status, expires_at)
            VALUES (?, ?, ?, ?, ?, ?, 'pending', datetime('now', '+72 hours'))`,
      args: [league_id, winner_id, loser_id, note || null, winner_score || 0, loser_score || 0]
    })
    const game = await db.execute({
      sql: 'SELECT * FROM games WHERE id = ?',
      args: [Number(result.lastInsertRowid)]
    })
    res.json(game.rows[0])
  } catch (err) {
    res.status(500).json({ error: 'שגיאה' })
  }
})

router.get('/league/:league_id', auth, async (req, res) => {
  try {
    const result = await db.execute({
      sql: `SELECT g.id, g.note, g.played_at, g.winner_score, g.loser_score,
              w.username as winner_username, w.full_name as winner_name,
              l.username as loser_username, l.full_name as loser_name
            FROM games g
            JOIN users w ON w.id = g.winner_id
            JOIN users l ON l.id = g.loser_id
            WHERE g.league_id = ? AND g.status = 'confirmed'
            ORDER BY g.played_at DESC`,
      args: [req.params.league_id]
    })
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: 'שגיאה' })
  }
})

router.delete('/:id', auth, async (req, res) => {
  try {
    const gameRes = await db.execute({ sql: 'SELECT * FROM games WHERE id = ?', args: [req.params.id] })
    const game = gameRes.rows[0]
    if (!game) return res.status(404).json({ error: 'משחק לא נמצא' })
    if (Number(game.winner_id) !== req.user.id && Number(game.loser_id) !== req.user.id)
      return res.status(403).json({ error: 'לא מורשה למחוק משחק זה' })
    await db.execute({ sql: 'DELETE FROM games WHERE id = ?', args: [req.params.id] })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'שגיאה' })
  }
})

router.patch('/:id/note', auth, async (req, res) => {
  try {
    const gameRes = await db.execute({ sql: 'SELECT * FROM games WHERE id = ?', args: [req.params.id] })
    const game = gameRes.rows[0]
    if (!game) return res.status(404).json({ error: 'משחק לא נמצא' })
    if (Number(game.winner_id) !== req.user.id && Number(game.loser_id) !== req.user.id)
      return res.status(403).json({ error: 'לא מורשה' })
    await db.execute({ sql: 'UPDATE games SET note = NULL WHERE id = ?', args: [req.params.id] })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'שגיאה' })
  }
})

router.get('/pending/:league_id', auth, async (req, res) => {
  try {
    const result = await db.execute({
      sql: `SELECT g.*, w.full_name as winner_name
            FROM games g
            JOIN users w ON w.id = g.winner_id
            WHERE g.league_id = ? AND g.loser_id = ?
            AND g.status = 'pending'
            AND datetime(g.expires_at) > datetime('now')`,
      args: [req.params.league_id, req.user.id]
    })
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: 'שגיאה' })
  }
})

router.post('/:id/confirm', auth, async (req, res) => {
  try {
    await db.execute({
      sql: `UPDATE games SET status = 'confirmed' WHERE id = ? AND loser_id = ?`,
      args: [req.params.id, req.user.id]
    })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'שגיאה' })
  }
})

router.post('/:id/reject', auth, async (req, res) => {
  try {
    await db.execute({
      sql: 'DELETE FROM games WHERE id = ? AND loser_id = ?',
      args: [req.params.id, req.user.id]
    })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'שגיאה' })
  }
})

module.exports = router