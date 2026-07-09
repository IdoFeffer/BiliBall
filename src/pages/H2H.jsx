import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/H2H.scss'
import { players } from '../api'
import BottomNav from '../components/BottomNav'

const COLOR_A = '#6D5AE0'
const COLOR_B = '#2563EB'

function initial(name) {
  return name?.[0]?.toUpperCase() || '?'
}

function computeStreak(games) {
  if (!games || games.length === 0) return null
  const first = games[0]
  if (first.winner_score === first.loser_score) return null
  const leaderId = String(first.winner_id)
  const leaderName = first.winner_name
  let count = 0
  for (const g of games) {
    const draw = g.winner_score === g.loser_score
    if (!draw && String(g.winner_id) === leaderId) count++
    else break
  }
  return count >= 2 ? { name: leaderName, count } : null
}

function H2H() {
  const navigate = useNavigate()
  const [leaguePlayers, setLeaguePlayers] = useState([])
  const [player1, setPlayer1] = useState('')
  const [player2, setPlayer2] = useState('')
  const [h2hData, setH2hData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [barAnimated, setBarAnimated] = useState(false)

  const leagueId = localStorage.getItem('leagueId')

  // Load Sora font for score numbers
  useEffect(() => {
    if (!document.getElementById('sora-font')) {
      const link = document.createElement('link')
      link.id = 'sora-font'
      link.rel = 'stylesheet'
      link.href = 'https://fonts.googleapis.com/css2?family=Sora:wght@900&display=swap'
      document.head.appendChild(link)
    }
  }, [])

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
      setBarAnimated(false)
      try {
        const res = await players.getH2H(player1, player2, leagueId)
        setH2hData(res.data)
        setTimeout(() => setBarAnimated(true), 60)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchH2H()
  }, [player1, player2])

  const getPlayer = (id) => leaguePlayers.find((p) => String(p.id) === String(id))
  const p1 = getPlayer(player1)
  const p2 = getPlayer(player2)
  const p1Name = p1?.full_name || p1?.username || ''
  const p2Name = p2?.full_name || p2?.username || ''

  const p1Wins = h2hData?.user1Wins || 0
  const total = h2hData?.total || 0
  const p1Pct = total > 0 ? Math.round((p1Wins / total) * 100) : 0
  const p2Pct = total > 0 ? 100 - p1Pct : 0

  const p1TotalPoints = h2hData
    ? h2hData.games.reduce((sum, g) => sum + (String(g.winner_id) === String(player1) ? g.winner_score : g.loser_score), 0)
    : 0
  const p2TotalPoints = h2hData
    ? h2hData.games.reduce((sum, g) => sum + (String(g.winner_id) === String(player2) ? g.winner_score : g.loser_score), 0)
    : 0

  const streak = h2hData ? computeStreak(h2hData.games) : null
  const hasGames = total > 0

  return (
    <div className="h2hPage">
      {/* Sub-header */}
      <header className="h2hHeader">
        <button className="h2hBack" onClick={() => navigate('/home')}>←</button>
        <h2 className="h2hTitle">ראש בראש</h2>
        <div className="h2hHeaderSpacer" />
      </header>

      {/* Player pickers */}
      <div className="h2hPickers">
        {/* Player A */}
        <div className="pickerWrap">
          <div className="pickerCard pickerCardA">
            <div className="pickerAvatar" style={{ background: COLOR_A }}>
              {initial(p1Name)}
            </div>
            <span className="pickerName">{p1Name || 'בחר...'}</span>
            <span className="pickerCaret">▾</span>
          </div>
          <select
            className="pickerSelect"
            value={player1}
            onChange={(e) => setPlayer1(e.target.value)}
          >
            {leaguePlayers.map((p) => (
              <option key={p.id} value={p.id} disabled={String(p.id) === String(player2)}>
                {p.full_name || p.username}
              </option>
            ))}
          </select>
        </div>

        <div className="pickerVs">VS</div>

        {/* Player B */}
        <div className="pickerWrap">
          <div className="pickerCard pickerCardB">
            <div className="pickerAvatar" style={{ background: COLOR_B }}>
              {initial(p2Name)}
            </div>
            <span className="pickerName">{p2Name || 'בחר...'}</span>
            <span className="pickerCaret">▾</span>
          </div>
          <select
            className="pickerSelect"
            value={player2}
            onChange={(e) => setPlayer2(e.target.value)}
          >
            {leaguePlayers.map((p) => (
              <option key={p.id} value={p.id} disabled={String(p.id) === String(player1)}>
                {p.full_name || p.username}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading */}
      {loading && <div className="h2hLoading">טוען...</div>}

      {/* Content */}
      {!loading && h2hData && (
        <>
          {!hasGames ? (
            /* Empty state */
            <div className="h2hEmpty">
              <span className="h2hEmptyIcon">🎱</span>
              <p className="h2hEmptyText">עוד לא שיחקו אחד נגד השני</p>
            </div>
          ) : (
            <>
              {/* Rivalry hero card */}
              <div className="rivalCard">
                {/* Players */}
                <div className="rivalPlayers">
                  <div className="rivalPlayer">
                    <div className="rivalAvatar" style={{ background: COLOR_A }}>
                      {initial(p1Name)}
                    </div>
                    <span className="rivalName">{p1Name}</span>
                  </div>
                  <span className="rivalAllTime">ALL-TIME</span>
                  <div className="rivalPlayer">
                    <div className="rivalAvatar" style={{ background: COLOR_B }}>
                      {initial(p2Name)}
                    </div>
                    <span className="rivalName">{p2Name}</span>
                  </div>
                </div>

                {/* Score — LTR so numbers read left-to-right; B on left, A on right to match positions */}
                <div className="rivalScore">
                  <span className="rivalNum rivalNumB">{p2TotalPoints}</span>
                  <span className="rivalDash">–</span>
                  <span className="rivalNum rivalNumA">{p1TotalPoints}</span>
                </div>

                {/* Split bar — RTL: A fills from right, B from left */}
                <div className="rivalBarTrack">
                  <div className="rivalBarA" style={{ width: barAnimated ? `${p1Pct}%` : '0%' }} />
                  <div className="rivalBarB" style={{ width: barAnimated ? `${p2Pct}%` : '0%' }} />
                </div>

                {/* Win percentages */}
                <div className="rivalPcts">
                  <span className="rivalPctA">{p1Pct}%</span>
                  <span className="rivalPctB">{p2Pct}%</span>
                </div>

                {/* Streak — only if active */}
                {streak && (
                  <div className="rivalStreak">
                    🔥 {streak.name} ברצף של {streak.count}
                  </div>
                )}
              </div>

              {/* Recent games */}
              <div className="gamesCard">
                <div className="gamesCardHeader">
                  <span className="gamesCardTitle">המשחקים האחרונים</span>
                </div>
                {h2hData.games.map((game) => {
                  const isDraw = game.winner_score === game.loser_score
                  const isP1Win = String(game.winner_id) === String(player1)
                  const hasScore = game.winner_score > 0 || game.loser_score > 0
                  return (
                    <div key={game.id} className="gameRow">
                      <div className={`gameBadge ${isDraw ? 'gameBadgeDraw' : isP1Win ? 'gameBadgeA' : 'gameBadgeB'}`}>
                        {isDraw ? '=' : initial(game.winner_name)}
                      </div>
                      <span className="gameResult">
                        {isDraw
                          ? <span>תיקו</span>
                          : <><strong>{game.winner_name}</strong> ניצח</>}
                      </span>
                      {hasScore && (
                        <span className="gameScore">
                          {game.winner_score}–{game.loser_score}
                        </span>
                      )}
                      <span className="gameDate">
                        {new Date(game.played_at).toLocaleDateString('he-IL')}
                      </span>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </>
      )}

      <BottomNav active="h2h" />
    </div>
  )
}

export default H2H
