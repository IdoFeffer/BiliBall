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

router.get('/:league_id', auth, async (req, res) => {
  try {
    const result = await db.execute({
      sql: `SELECT a.id, a.content, a.created_at,
              u.full_name, u.username,
              ua.avatar_url,
              COUNT(l.id) as like_count,
              MAX(CASE WHEN l.user_id = ? THEN 1 ELSE 0 END) as liked_by_me
            FROM announcements a
            JOIN users u ON a.user_id = u.id
            LEFT JOIN announcement_likes l ON l.announcement_id = a.id
            LEFT JOIN user_avatars ua ON ua.user_id = u.id
            WHERE a.league_id = ?
            GROUP BY a.id
            ORDER BY a.created_at DESC
            LIMIT 50`,
      args: [req.user.id, req.params.league_id],
    })
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', auth, async (req, res) => {
  const { league_id, content } = req.body
  if (!content?.trim()) return res.status(400).json({ error: 'תוכן ריק' })
  try {
    await db.execute({
      sql: `INSERT INTO announcements (league_id, user_id, content) VALUES (?, ?, ?)`,
      args: [league_id, req.user.id, content.trim()],
    })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/:id', auth, async (req, res) => {
  const { content } = req.body
  if (!content?.trim()) return res.status(400).json({ error: 'תוכן ריק' })
  try {
    await db.execute({
      sql: `UPDATE announcements SET content = ? WHERE id = ? AND user_id = ?`,
      args: [content.trim(), req.params.id, req.user.id],
    })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/:id', auth, async (req, res) => {
  try {
    await db.execute({
      sql: `DELETE FROM announcements WHERE id = ? AND user_id = ?`,
      args: [req.params.id, req.user.id],
    })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/:id/like', auth, async (req, res) => {
  try {
    const existing = await db.execute({
      sql: `SELECT id FROM announcement_likes WHERE announcement_id = ? AND user_id = ?`,
      args: [req.params.id, req.user.id],
    })
    if (existing.rows[0]) {
      await db.execute({
        sql: `DELETE FROM announcement_likes WHERE announcement_id = ? AND user_id = ?`,
        args: [req.params.id, req.user.id],
      })
      res.json({ liked: false })
    } else {
      await db.execute({
        sql: `INSERT INTO announcement_likes (announcement_id, user_id) VALUES (?, ?)`,
        args: [req.params.id, req.user.id],
      })
      res.json({ liked: true })
    }
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
