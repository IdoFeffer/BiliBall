import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/AddGame.scss'
import { games, leagues } from '../api'

function AddGame() {
  const navigate = useNavigate()
  const [opponent, setOpponent] = useState('')
  const [myScore, setMyScore] = useState(0)
  const [oppScore, setOppScore] = useState(0)
  const [note, setNote] = useState('')
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const leagueId = localStorage.getItem('leagueId')

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await leagues.getMembers(leagueId)
        const others = res.data.filter((m) => m.id !== user.id)
        setMembers(others)
        if (others.length > 0) setOpponent(others[0].id)
      } catch (err) {
        console.error(err)
      }
    }
    fetchMembers()
  }, [])

  const handleSubmit = async () => {
    if (!opponent) return
    if (myScore === oppScore) {
      setError('לא יכול להיות תיקו — מישהו חייב לנצח')
      return
    }
    setLoading(true)
    setError('')
    try {
      const iWon = myScore > oppScore
      const winnerId = iWon ? user.id : parseInt(opponent)
      const loserId = iWon ? parseInt(opponent) : user.id
      const winnerScore = iWon ? myScore : oppScore
      const loserScore = iWon ? oppScore : myScore

      console.log('sending:', {
        winner_id: winnerId,
        loser_id: loserId,
        winner_score: winnerScore,
        loser_score: loserScore,
      }) 

      await games.add({
        league_id: parseInt(leagueId),
        winner_id: winnerId,
        loser_id: loserId,
        winner_score: winnerScore,
        loser_score: loserScore,
        note,
      })
      navigate('/home')
    } catch (err) {
      setError(err.response?.data?.error || 'משהו השתבש')
    } finally {
      setLoading(false)
    }
  }

  const oppName =
    members.find((m) => m.id == opponent)?.full_name ||
    members.find((m) => m.id == opponent)?.username ||
    'יריב'

  return (
    <div className="page">
      <header className="header">
        <h2 className="headerTitle">הוספת משחק</h2>
        <div style={{ width: 60 }} />
      </header>

      <div className="section">
        <p className="label">נגד מי?</p>
        {members.length === 0 ? (
          <p style={{ fontSize: '13px', color: '#999' }}>
            אין חברים בליגה עדיין
          </p>
        ) : (
          <select
            className="select"
            value={opponent}
            onChange={(e) => setOpponent(e.target.value)}
          >
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.full_name || member.username}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="section">
        <p className="label">סקור סיבובים</p>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 4,
          }}
        >
          <div style={{ flex: 1, textAlign: 'center' }}>
            <p style={{ fontSize: 12, color: '#888', marginBottom: 10 }}>אני</p>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
              }}
            >
              <button
                className="scoreBtn minus"
                onClick={() => setMyScore((s) => Math.max(0, s - 1))}
              >
                −
              </button>
              <span
                style={{
                  fontSize: 32,
                  fontWeight: 700,
                  minWidth: 40,
                  textAlign: 'center',
                }}
              >
                {myScore}
              </span>
              <button
                className="scoreBtn plus"
                onClick={() => setMyScore((s) => Math.min(10, s + 1))}
              >
                +
              </button>
            </div>
          </div>
          <span style={{ fontSize: 28, color: '#ccc', padding: '0 8px' }}>
            :
          </span>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <p style={{ fontSize: 12, color: '#888', marginBottom: 10 }}>
              {oppName}
            </p>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
              }}
            >
              <button
                className="scoreBtn minus"
                onClick={() => setOppScore((s) => Math.max(0, s - 1))}
              >
                −
              </button>
              <span
                style={{
                  fontSize: 32,
                  fontWeight: 700,
                  minWidth: 40,
                  textAlign: 'center',
                }}
              >
                {oppScore}
              </span>
              <button
                className="scoreBtn plus"
                onClick={() => setOppScore((s) => Math.min(10, s + 1))}
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <p className="label">הערה (אופציונלי)</p>
        <input
          className="input"
          type="text"
          placeholder="משחק מטורף..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      {error && (
        <p style={{ color: 'red', fontSize: '13px', padding: '0 16px' }}>
          {error}
        </p>
      )}

      <p className="notice">ⓘ מי שיש לו יותר סיבובים נרשם כמנצח</p>

      <button
        className="submitBtn"
        onClick={handleSubmit}
        disabled={loading || members.length === 0}
      >
        {loading ? 'שומר...' : 'שמור תוצאה'}
      </button>
    </div>
  )
}

export default AddGame
