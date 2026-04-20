import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/H2H.scss'
import { players } from '../api'
import H2HSkeleton from '../components/H2HSkeleton'

function H2H() {
  const navigate = useNavigate()
  const [leaguePlayers, setLeaguePlayers] = useState([])
  const [player1, setPlayer1] = useState('')
  const [player2, setPlayer2] = useState('')
  const [h2hData, setH2hData] = useState(null)
  const [loading, setLoading] = useState(false)

  const leagueId = localStorage.getItem('leagueId')
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const res = await players.getLeaguePlayers(leagueId)
        setLeaguePlayers(res.data)
        if (res.data.length >= 2) {
          setPlayer1(String(res.data[0].id))
          setPlayer2(String(res.data[1].id))
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchPlayers()
  }, [])

  useEffect(() => {
    if (!player1 || !player2 || player1 === player2) return
    const fetchH2H = async () => {
      setLoading(true)
      try {
        const res = await players.getH2H(player1, player2, leagueId)
        setH2hData(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchH2H()
  }, [player1, player2])

  const getPlayerName = (id) => {
    const p = leaguePlayers.find((p) => String(p.id) === String(id))
    return p?.full_name || p?.username || ''
  }

  const total = h2hData?.total || 0
  const p1Wins = h2hData?.user1Wins || 0
  const p2Wins = h2hData?.user2Wins || 0
  const p1Pct = total > 0 ? Math.round((p1Wins / total) * 100) : 50
  const p2Pct = total > 0 ? Math.round((p2Wins / total) * 100) : 50
  const leader =
    p1Wins > p2Wins
      ? getPlayerName(player1)
      : p2Wins > p1Wins
        ? getPlayerName(player2)
        : null

  return (
    <div className="page">
      <header className="header">
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
            {leaguePlayers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.full_name || p.username}
              </option>
            ))}
          </select>
          <span className="vsLabel">VS</span>
          <select
            className="select"
            value={player2}
            onChange={(e) => setPlayer2(e.target.value)}
          >
            {leaguePlayers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.full_name || p.username}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && <H2HSkeleton />}
      {!loading && h2hData && (
        <>
          <div className="scoreSection">
            <div className="scoreRow">
              <div className="playerSide">
                <div className="avatarLg">{getPlayerName(player1)[0]}</div>
                <span className="playerName">{getPlayerName(player1)}</span>
                <span className="playerScore">{p1Wins}</span>
                <span className="playerScoreLabel">נצחונות</span>
              </div>
              <div className="vsCenter">
                <span className="vsCenterLabel">VS</span>
                <span className="totalGames">{total} משחקים</span>
              </div>
              <div className="playerSide">
                <div className="avatarLg green">
                  {getPlayerName(player2)[0]}
                </div>
                <span className="playerName">{getPlayerName(player2)}</span>
                <span className="playerScore">{p2Wins}</span>
                <span className="playerScoreLabel">נצחונות</span>
              </div>
            </div>

            <div className="barWrap">
              <div className="barLabels">
                <span className="barLabel">{p1Pct}%</span>
                <span className="barLabel right">{p2Pct}%</span>
              </div>
              <div className="barTrack">
                <div className="barFillLeft" style={{ width: `${p1Pct}%` }} />
                <div className="barFillRight" style={{ width: `${p2Pct}%` }} />
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
            {h2hData.games.length === 0 && (
              <p className="emptyText">אין משחקים ביניהם עדיין</p>
            )}
            {h2hData.games.map((game) => (
              <div key={game.id} className="historyRow">
                <span
                  className={`resultBadge ${game.winner_id == player1 ? 'win' : 'lose'}`}
                >
                  {game.winner_name} ניצח
                </span>
                <span className="historyDate">
                  {new Date(game.played_at).toLocaleDateString('he-IL')}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default H2H
