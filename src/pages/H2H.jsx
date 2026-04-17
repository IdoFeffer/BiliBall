import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const mockPlayers = ['יוסי', 'דני', 'מור', 'רון']

const mockGames = [
  { id: 1, winner: 'יוסי', loser: 'דני', date: 'היום' },
  { id: 2, winner: 'יוסי', loser: 'דני', date: 'אתמול' },
  { id: 3, winner: 'דני', loser: 'יוסי', date: '14.4' },
  { id: 4, winner: 'יוסי', loser: 'דני', date: '12.4' },
  { id: 5, winner: 'דני', loser: 'יוסי', date: '10.4' },
]

function H2H() {
  const navigate = useNavigate()
  const [player1, setPlayer1] = useState('יוסי')
  const [player2, setPlayer2] = useState('דני')

  const filteredGames = mockGames.filter(game =>
    (game.winner === player1 && game.loser === player2) ||
    (game.winner === player2 && game.loser === player1)
  )

  const player1Wins = filteredGames.filter(g => g.winner === player1).length
  const player2Wins = filteredGames.filter(g => g.winner === player2).length
  const total = filteredGames.length

  return (
    <div>
      <button onClick={() => navigate('/home')}>← חזרה</button>
      <h2>ראש בראש</h2>

      <div>
        <select
          value={player1}
          onChange={(e) => setPlayer1(e.target.value)}
        >
          {mockPlayers.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        <span>VS</span>

        <select
          value={player2}
          onChange={(e) => setPlayer2(e.target.value)}
        >
          {mockPlayers.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <div>
        <div>
          <p>{player1}</p>
          <p>{player1Wins}</p>
          <p>נצחונות</p>
        </div>
        <div>
          <p>VS</p>
          <p>{total} משחקים</p>
        </div>
        <div>
          <p>{player2}</p>
          <p>{player2Wins}</p>
          <p>נצחונות</p>
        </div>
      </div>

      {total > 0 && (
        <div>
          <p>
            {player1Wins > player2Wins ? player1 : player2} מוביל בסדרה
          </p>
        </div>
      )}

      <h3>היסטוריה ביניהם</h3>
      {filteredGames.length === 0 && <p>אין משחקים ביניהם</p>}
      {filteredGames.map(game => (
        <div key={game.id}>
          <span>{game.winner === player1 ? `${player1} ניצח` : `${player2} ניצח`}</span>
          <span>{game.date}</span>
        </div>
      ))}
    </div>
  )
}

export default H2H