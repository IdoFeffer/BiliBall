import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/H2H.scss'

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
  const player1Pct = total > 0 ? Math.round((player1Wins / total) * 100) : 50
  const player2Pct = total > 0 ? Math.round((player2Wins / total) * 100) : 50
  const leader = player1Wins > player2Wins ? player1 : player2Wins > player1Wins ? player2 : null

  return (
    <div className="page">
      <header className="header">
        <button className="backBtn" onClick={() => navigate('/home')}>← חזרה</button>
        <h2 className="headerTitle">ראש בראש</h2>
        <div style={{ width: 60 }} />
      </header>

      <div className="section">
        <div className="selectorRow">
          <select
            className="select"
            value={player1}
            onChange={(e) => setPlayer1(e.target.value)}
          >
            {mockPlayers.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <span className="vsLabel">VS</span>
          <select
            className="select"
            value={player2}
            onChange={(e) => setPlayer2(e.target.value)}
          >
            {mockPlayers.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="scoreSection">
        <div className="scoreRow">
          <div className="playerSide">
            <div className="avatarLg">{player1[0]}</div>
            <span className="playerName">{player1}</span>
            <span className="playerScore">{player1Wins}</span>
            <span className="playerScoreLabel">נצחונות</span>
          </div>
          <div className="vsCenter">
            <span className="vsCenterLabel">VS</span>
            <span className="totalGames">{total} משחקים</span>
          </div>
          <div className="playerSide">
            <div className="avatarLg green">{player2[0]}</div>
            <span className="playerName">{player2}</span>
            <span className="playerScore">{player2Wins}</span>
            <span className="playerScoreLabel">נצחונות</span>
          </div>
        </div>

        <div className="barWrap">
          <div className="barLabels">
            <span className="barLabel">{player1Pct}%</span>
            <span className="barLabel right">{player2Pct}%</span>
          </div>
          <div className="barTrack">
            <div className="barFillLeft" style={{ width: `${player1Pct}%` }} />
            <div className="barFillRight" style={{ width: `${player2Pct}%` }} />
          </div>
        </div>

        {leader && (
          <div className="winnerBanner">
            <span className="winnerText">{leader} מוביל בסדרה</span>
          </div>
        )}
      </div>

      <div className="section">
        <p className="sectionTitle">היסטוריה ביניהם</p>
        {filteredGames.length === 0 && (
          <p className="emptyText">אין משחקים ביניהם עדיין</p>
        )}
        {filteredGames.map(game => (
          <div key={game.id} className="historyRow">
            <span className={`resultBadge ${game.winner === player1 ? 'win' : 'lose'}`}>
              {game.winner === player1 ? `${player1} ניצח` : `${player2} ניצח`}
            </span>
            <span className="historyDate">{game.date}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default H2H