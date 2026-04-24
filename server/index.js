require('dotenv').config()
const express = require('express')
const cors = require('cors')
const session = require('express-session')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const jwt = require('jsonwebtoken')
const { db, initDB } = require('./database')
const authRoutes = require('./routes/auth')
const leagueRoutes = require('./routes/leagues')
const gameRoutes = require('./routes/games')
const playerRoutes = require('./routes/players')

const app = express()
const PORT = process.env.PORT || 3000
const SECRET = 'biliball_secret_key'

app.use(
  cors({
    origin: ['http://localhost:5173', 'https://bili-ball.vercel.app'],
    credentials: true,
  }),
)

app.use(express.json())

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'biliball_session',
    resave: false,
    saveUninitialized: false,
  }),
)

app.use(passport.initialize())
app.use(passport.session())

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.NODE_ENV === 'production'
          ? 'https://biliball.onrender.com/api/auth/google/callback'
          : 'http://localhost:3000/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value
        const fullName = profile.displayName
        const googleId = profile.id

        let res = await db.execute({
          sql: 'SELECT * FROM users WHERE google_id = ?',
          args: [googleId],
        })
        let user = res.rows[0]

        if (!user) {
          res = await db.execute({
            sql: 'SELECT * FROM users WHERE username = ?',
            args: [email],
          })
          user = res.rows[0]
          if (user) {
            await db.execute({
              sql: 'UPDATE users SET google_id = ? WHERE id = ?',
              args: [googleId, user.id],
            })
          } else {
            const result = await db.execute({
              sql: 'INSERT INTO users (username, full_name, google_id, password) VALUES (?, ?, ?, ?)',
              args: [email, fullName, googleId, ''],
            })
            res = await db.execute({
              sql: 'SELECT * FROM users WHERE id = ?',
              args: [result.lastInsertRowid],
            })
            user = res.rows[0]
          }
        }
        return done(null, user)
      } catch (err) {
        return done(err)
      }
    },
  ),
)

passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser(async (id, done) => {
  try {
    const res = await db.execute({
      sql: 'SELECT * FROM users WHERE id = ?',
      args: [id],
    })
    done(null, res.rows[0])
  } catch (err) {
    done(err)
  }
})

app.get(
  '/api/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
)

app.get(
  '/api/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const user = req.user
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET)
    const userData = {
      id: user.id,
      username: user.username,
      full_name: user.full_name,
    }
    const frontendUrl =
      process.env.NODE_ENV === 'production'
        ? 'https://bili-ball.vercel.app'
        : 'http://localhost:5173'
    res.redirect(
      `${frontendUrl}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify(userData))}`,
    )
  },
)

app.use('/api/auth', authRoutes)
app.use('/api/leagues', leagueRoutes)
app.use('/api/games', gameRoutes)
app.use('/api/players', playerRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'BiliBall Server Running!' })
})

initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.error('DB init failed:', err)
    process.exit(1)
  })
