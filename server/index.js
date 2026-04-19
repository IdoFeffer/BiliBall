const express = require('express')
const cors = require('cors')
const authRoutes = require('./routes/auth')
const leagueRoutes = require('./routes/leagues')
const gameRoutes = require('./routes/games')
const playerRoutes = require('./routes/players')

const app = express()
const PORT = process.env.PORT || 3000

app.use(
  cors({
    origin: ['http://localhost:5173', 'https://bili-ball.vercel.app'],
  }),
)

app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/leagues', leagueRoutes)
app.use('/api/games', gameRoutes)
app.use('/api/players', playerRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'BiliBall Server Running!' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
