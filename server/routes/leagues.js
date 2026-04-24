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

const generateCode = () =>
  Math.random().toString(36).substring(2, 8).toUpperCase()

router.post('/create', auth, async (req, res) => {
  const { name } = req.body
  if (!name) return res.status(400).json({ error: 'שם הליגה נדרש' })
  try {
    const invite_code = generateCode()
    const result = await db.execute({
      sql: 'INSERT INTO leagues (name, invite_code, created_by) VALUES (?, ?, ?)',
      args: [name, invite_code, req.user.id]
    })
    await db.execute({
      sql: 'INSERT INTO league_members (league_id, user_id, role) VALUES (?, ?, ?)',
      args: [Number(result.lastInsertRowid), req.user.id, 'admin']
    })
    const league = await db.execute({
      sql: 'SELECT * FROM leagues WHERE id = ?',
      args: [Number(result.lastInsertRowid)]
    })
    res.json(league.rows[0])
  } catch (err) {
    res.status(500).json({ error: 'שגיאה ביצירת ליגה' })
  }
})

router.post('/join', auth, async (req, res) => {
  try {
    const { invite_code } = req.body
    const leagueRes = await db.execute({
      sql: 'SELECT * FROM leagues WHERE invite_code = ?',
      args: [invite_code]
    })
    const league = leagueRes.rows[0]
    if (!league) return res.status(404).json({ error: 'ליגה לא נמצאה' })

    const existingRes = await db.execute({
      sql: 'SELECT * FROM league_members WHERE league_id = ? AND user_id = ?',
      args: [league.id, req.user.id]
    })
    if (existingRes.rows[0]) return res.status(400).json({ error: 'כבר חבר בליגה' })

    await db.execute({
      sql: 'INSERT INTO league_members (league_id, user_id, role) VALUES (?, ?, ?)',
      args: [league.id, req.user.id, 'member']
    })
    res.json(league)
  } catch (err) {
    res.status(500).json({ error: 'שגיאה בהצטרפות' })
  }
})

router.get('/user/all', auth, async (req, res) => {
  try {
    const result = await db.execute({
      sql: `SELECT l.* FROM leagues l
            JOIN league_members lm ON lm.league_id = l.id
            WHERE lm.user_id = ?
            ORDER BY lm.joined_at DESC`,
      args: [req.user.id]
    })
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: 'שגיאה' })
  }
})

router.get('/user', auth, async (req, res) => {
  try {
    const result = await db.execute({
      sql: `SELECT l.* FROM leagues l
            JOIN league_members lm ON lm.league_id = l.id
            WHERE lm.user_id = ?
            ORDER BY lm.joined_at DESC
            LIMIT 1`,
      args: [req.user.id]
    })
    res.json(result.rows[0] || null)
  } catch (err) {
    res.status(500).json({ error: 'שגיאה' })
  }
})

router.get('/:id/members', auth, async (req, res) => {
  try {
    const result = await db.execute({
      sql: `SELECT u.id, u.username, u.full_name, lm.role
            FROM league_members lm
            JOIN users u ON u.id = lm.user_id
            WHERE lm.league_id = ?`,
      args: [req.params.id]
    })
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: 'שגיאה' })
  }
})

router.post('/:id/leave', auth, async (req, res) => {
  try {
    const leagueId = req.params.id
    const memberRes = await db.execute({
      sql: 'SELECT * FROM league_members WHERE league_id = ? AND user_id = ?',
      args: [leagueId, req.user.id]
    })
    if (!memberRes.rows[0]) return res.status(404).json({ error: 'לא חבר בליגה' })

    await db.execute({
      sql: 'DELETE FROM league_members WHERE league_id = ? AND user_id = ?',
      args: [leagueId, req.user.id]
    })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'שגיאה' })
  }
})

router.delete('/:id', auth, async (req, res) => {
  try {
    const leagueId = req.params.id
    const memberRes = await db.execute({
      sql: 'SELECT * FROM league_members WHERE league_id = ? AND user_id = ?',
      args: [leagueId, req.user.id]
    })
    const member = memberRes.rows[0]
    if (!member || member.role !== 'admin')
      return res.status(403).json({ error: 'אין הרשאה' })

    await db.execute({ sql: 'DELETE FROM league_members WHERE league_id = ?', args: [leagueId] })
    await db.execute({ sql: 'DELETE FROM leagues WHERE id = ?', args: [leagueId] })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'שגיאה' })
  }
})

module.exports = router