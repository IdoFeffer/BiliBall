import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/AddGame.scss'
import { games, leagues } from '../api'
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

  const user = JSON.parse(localStorage.getItem('user') || '{}')
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
      try {
        const res = await leagues.getMembers(leagueId)
        const others = res.data.filter((m) => m.id !== user.id)
        setMembers(others)
        if (others.length > 0) setOpponent(others[0])
      } catch (err) {
        console.error(err)
      }
    }
    fetchMembers()
  }, [])

  const handleSubmit = async () => {
    if (!opponent) return
    setLoading(true)
    setError('')
    try {
      const iWon = myScore > oppScore
      const winnerId = iWon ? user.id : opponent.id
      const loserId = iWon ? opponent.id : user.id
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
  const myName = user.full_name || user.username || 'אני'
  const oppName = opponent?.full_name || opponent?.username || 'בחר יריב'

  return (
    <div className="agPage">
      {/* Sub-header */}
      <header className="agHeader">
        <button className="agHeaderBtn" onClick={() => navigate(-1)}>←</button>
        <h2 className="agHeaderTitle">הוספת משחק</h2>
        <button className="agHeaderBtn" onClick={() => navigate('/home')}>✕</button>
      </header>

      <div className="agBody">
        {/* VS matchup card */}
        <div className="agMatchCard">
          {/* Me — DOM first = visual right in RTL */}
          <div className="agPlayer">
            <div className="agAvatar agAvatarMe">{initial(myName)}</div>
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
            <div className="agAvatar agAvatarOpp">{initial(oppName)}</div>
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
                  <div className="agPickerAvatar">{initial(name)}</div>
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
