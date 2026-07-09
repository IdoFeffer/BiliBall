import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/AddGame.scss'
import { games, leagues, players } from '../api'
import BottomNav from '../components/BottomNav'

function AddGame() {
  const navigate = useNavigate()
  const [opponent, setOpponent] = useState(null)
  const [myScore, setMyScore] = useState(0)
  const [oppScore, setOppScore] = useState(0)
  const [note, setNote] = useState('')
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [pickerOpen, setPickerOpen] = useState(false)

  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem('user') || '{}'),
  )
  const leagueId = localStorage.getItem('leagueId')

  useEffect(() => {
    if (!document.getElementById('addgame-fonts')) {
      const link = document.createElement('link')
      link.id = 'addgame-fonts'
      link.rel = 'stylesheet'
      link.href =
        'https://fonts.googleapis.com/css2?family=Heebo:wght@700;800;900&family=Assistant:wght@400;600;700&family=Sora:wght@900&display=swap'
      document.head.appendChild(link)
    }
  }, [])

  useEffect(() => {
    const fetchMembers = async () => {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}')
      try {
        const [membersRes, playersRes] = await Promise.all([
          leagues.getMembers(leagueId),
          players.getLeaguePlayers(leagueId),
        ])
        // Build avatar lookup from the players endpoint (guaranteed to have avatar_url)
        const avatarMap = {}
        for (const p of playersRes.data) avatarMap[p.id] = p.avatar_url || null

        const allMembers = membersRes.data.map((m) => ({
          ...m,
          avatar_url: avatarMap[m.id] ?? m.avatar_url ?? null,
        }))

        const me = allMembers.find((m) => m.id === storedUser.id)
        if (me) setCurrentUser((u) => ({ ...u, avatar_url: me.avatar_url }))

        const others = allMembers.filter((m) => m.id !== storedUser.id)
        setMembers(others)
        if (others.length > 0) setOpponent(others[0])
      } catch (err) {
        console.error(err)
      }
    }
    fetchMembers()
  }, [leagueId])

  const handleSubmit = async () => {
    if (!opponent) return
    setLoading(true)
    setError('')
    try {
      const iWon = myScore > oppScore
      const winnerId = iWon ? currentUser.id : opponent.id
      const loserId = iWon ? opponent.id : currentUser.id
      const winnerScore = iWon ? myScore : oppScore
      const loserScore = iWon ? oppScore : myScore

      await games.add({
        league_id: parseInt(leagueId),
        winner_id: winnerId,
        loser_id: loserId,
        winner_score: winnerScore,
        loser_score: loserScore,
        note: note || undefined,
      })
      navigate('/home')
    } catch (err) {
      setError(err.response?.data?.error || 'משהו השתבש')
    } finally {
      setLoading(false)
    }
  }

  const initial = (name) => name?.[0]?.toUpperCase() || '?'
  const myName = currentUser.full_name || currentUser.username || 'אני'
  const oppName = opponent?.full_name || opponent?.username || 'בחר יריב'

  return (
    <div className="agPage">
      {/* Sub-header */}
      <header className="agHeader">
        <button className="agHeaderBtn" onClick={() => navigate(-1)}>
          ←
        </button>
        <h2 className="agHeaderTitle">הוספת משחק</h2>
        <button className="agHeaderBtn" onClick={() => navigate('/home')}>
          ✕
        </button>
      </header>

      <div className="agBody">
        {/* VS matchup card */}
        <div className="agMatchCard">
          {/* Me — DOM first = visual right in RTL */}
          <div className="agPlayer">
            {currentUser.avatar_url ? (
              <img src={currentUser.avatar_url} alt="" className="agAvatarImg" />
            ) : (
              <div className="agAvatar agAvatarMe">{initial(myName)}</div>
            )}
            <span className="agPlayerName">
              {myName}
              <span className="agYouTag"> (את/ה)</span>
            </span>
          </div>

          <span className="agVs">VS</span>

          {/* Opponent — DOM last = visual left in RTL, tappable */}
          <button
            className={`agPlayer agPlayerOpp${pickerOpen ? ' agPlayerOppOpen' : ''}`}
            onClick={() => setPickerOpen((v) => !v)}
          >
            {opponent?.avatar_url ? (
              <img src={opponent.avatar_url} alt="" className="agAvatarImg" />
            ) : (
              <div className="agAvatar agAvatarOpp">{initial(oppName)}</div>
            )}
            <span className="agPlayerName">
              {oppName}
              <span className="agChevron">{pickerOpen ? ' ▴' : ' ▾'}</span>
            </span>
          </button>
        </div>

        {/* Opponent picker panel */}
        <div className={`agPickerWrap${pickerOpen ? ' agPickerOpen' : ''}`}>
          <div className="agPickerInner">
            {members.map((m) => {
              const name = m.full_name || m.username
              const isSelected = opponent?.id === m.id
              return (
                <button
                  key={m.id}
                  className={`agPickerRow${isSelected ? ' agPickerRowSel' : ''}`}
                  onClick={() => {
                    setOpponent(m)
                    setPickerOpen(false)
                  }}
                >
                  {m.avatar_url ? (
                    <img
                      src={m.avatar_url}
                      alt=""
                      className="agPickerAvatarImg"
                    />
                  ) : (
                    <div className="agPickerAvatar">{initial(name)}</div>
                  )}
                  <span className="agPickerName">{name}</span>
                  {isSelected && <span className="agPickerCheck">✓</span>}
                </button>
              )
            })}
          </div>
        </div>

        {/* Score card */}
        <div className="agScoreCard">
          <p className="agScoreTitle">סיבובים שנוצחו</p>
          <div className="agScoreGrid">
            {/* Names */}
            <div className="agScoreNamesRow">
              <span className="agStepName">{myName}</span>
              <span />
              <span className="agStepName">{oppName}</span>
            </div>
            {/* Numbers */}
            <div className="agScoreNumsRow">
              <span className="agStepNum">{myScore}</span>
              <span className="agDash">–</span>
              <span className="agStepNum">{oppScore}</span>
            </div>
            {/* Buttons */}
            <div className="agScoreBtnsRow">
              <div className="agStepBtns">
                <button
                  className="agStepBtn agMinus"
                  onClick={() => setMyScore((s) => Math.max(0, s - 1))}
                >
                  −
                </button>
                <button
                  className="agStepBtn agPlus"
                  onClick={() => setMyScore((s) => Math.min(20, s + 1))}
                >
                  +
                </button>
              </div>
              <span />
              <div className="agStepBtns">
                <button
                  className="agStepBtn agMinus"
                  onClick={() => setOppScore((s) => Math.max(0, s - 1))}
                >
                  −
                </button>
                <button
                  className="agStepBtn agPlus"
                  onClick={() => setOppScore((s) => Math.min(20, s + 1))}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Note */}
        <div className="agNoteCard">
          <label className="agNoteLabel">הערה (אופציונלי)</label>
          <input
            className="agNoteInput"
            type="text"
            placeholder="משחק מטורף…"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        {error && <p className="agError">{error}</p>}

        {/* Save button */}
        <button
          className="agSaveBtn"
          onClick={handleSubmit}
          disabled={loading || !opponent}
        >
          {loading ? 'שומר...' : 'שמור תוצאה 🎱'}
        </button>
      </div>

      <BottomNav active="game" />
    </div>
  )
}

export default AddGame
