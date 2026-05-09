const express = require('express')
const router = express.Router()
const cloudinary = require('cloudinary').v2
const multer = require('multer')
const { db } = require('../database')
const jwt = require('jsonwebtoken')

const SECRET = 'biliball_secret_key'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

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

const storage = multer.memoryStorage()
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } })

router.post('/avatar', auth, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'לא נשלחה תמונה' })

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'biliball/avatars', transformation: [{ width: 200, height: 200, crop: 'fill' }] },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      ).end(req.file.buffer)
    })

    await db.execute({
      sql: `INSERT INTO user_avatars (user_id, avatar_url) VALUES (?, ?)
            ON CONFLICT(user_id) DO UPDATE SET avatar_url = excluded.avatar_url`,
      args: [req.user.id, result.secure_url],
    })

    res.json({ avatar_url: result.secure_url })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/avatar/:user_id', async (req, res) => {
  try {
    const result = await db.execute({
      sql: `SELECT avatar_url FROM user_avatars WHERE user_id = ?`,
      args: [req.params.user_id],
    })
    res.json({ avatar_url: result.rows[0]?.avatar_url || null })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router