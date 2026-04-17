import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const mockPlayers = [
  { id: 1, name: 'דני האבדיה', wins: 12, losses: 4 },
  { id: 2, name: 'ערן זהבי', wins: 9, losses: 6 },
  { id: 3, name: 'מסי', wins: 5, losses: 8 },
  { id: 4, name: 'רונאלדיניו', wins: 3, losses: 9 },
]

const mockGames = [
  { id: 1, winner: 'יוסי', loser: 'דני', date: 'היום' },
  { id: 2, winner: 'דני', loser: 'מור', date: 'אתמול' },
  { id: 3, winner: 'יוסי', loser: 'רון', date: '15.4' },
]

const isLoggedIn = false
const currentUser = 'יוסי'

function Home() {
  const navigate = useNavigate()

  return (
    <div>
      <nav>
        <div>
          <h1>BiliBall 🎱</h1>
          {isLoggedIn && <p>ליגת המרתף</p>}
        </div>
        {isLoggedIn
          ? <div>{currentUser[0]}</div>
          : <button onClick={() => navigate('/login')}>התחבר</button>
        }
      </nav>

      <section>
        <h2>לוח מובילים</h2>
        <div>
          {mockPlayers.map((player, index) => (
            <div key={player.id}>
              <span>{index + 1}</span>
              <span>{player.name}</span>
              {isLoggedIn && currentUser === player.name && <span>את/ה</span>}
              <span>{player.wins} נצ'</span>
              <span>{player.losses} הפ'</span>
              <span>{player.wins - player.losses > 0 ? '+' : ''}{player.wins - player.losses} מדד</span>
            </div>
          ))}

          {!isLoggedIn && (
            <div>
              <p>🔒 התחבר לראות את הליגה</p>
              <button onClick={() => navigate('/login')}>התחבר</button>
            </div>
          )}
        </div>
      </section>

      {isLoggedIn && (
        <section>
          <h2>משחקים אחרונים</h2>
          {mockGames.map(game => (
            <div key={game.id}>
              <span>{game.winner} ניצח את {game.loser}</span>
              <span>{game.date}</span>
            </div>
          ))}
        </section>
      )}

      {isLoggedIn && (
        <nav>
          <button onClick={() => navigate('/home')}>🏠 בית</button>
          <button onClick={() => navigate('/add-game')}>+ הוספת משחק</button>
          <button onClick={() => navigate('/profile')}>👤 פרופיל</button>
        </nav>
      )}
    </div>
  )
}

export default Home