import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/AddGame.scss'
import { games, leagues } from '../api'

function AddGame() {
  const navigate = useNavigate()
  const [result, setResult] = useState('win')
  const [opponent, setOpponent] = useState('')
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
        const others = res.data.filter(m => m.id !== user.id)
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
    setLoading(true)
    setError('')
    try {
      await games.add({
        league_id: parseInt(leagueId),
        loser_id: result === 'win' ? parseInt(opponent) : user.id,
        winner_id: result === 'win' ? user.id : parseInt(opponent),
        note,
      })
      navigate('/home')
    } catch (err) {
      setError(err.response?.data?.error || 'משהו השתבש')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <header className="header">
        <button className="backBtn" onClick={() => navigate('/home')}>← חזרה</button>
        <h2 className="headerTitle">הוספת משחק</h2>
        <div style={{ width: 60 }} />
      </header>

      <div className="section">
        <p className="label">תוצאה</p>
        <div className="toggleGroup">
          <button
            className={`toggleBtn ${result === 'win' ? 'active' : ''}`}
            onClick={() => setResult('win')}
          >
            אני ניצחתי
          </button>
          <button
            className={`toggleBtn ${result === 'lose' ? 'active' : ''}`}
            onClick={() => setResult('lose')}
          >
            אני הפסדתי
          </button>
        </div>
      </div>

      <div className="section">
        <p className="label">נגד מי?</p>
        {members.length === 0 ? (
          <p style={{ fontSize: '13px', color: '#999' }}>אין חברים בליגה עדיין</p>
        ) : (
          <select
            className="select"
            value={opponent}
            onChange={(e) => setOpponent(e.target.value)}
          >
            {members.map(member => (
              <option key={member.id} value={member.id}>
                {member.full_name || member.username}
              </option>
            ))}
          </select>
        )}
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

      {error && <p style={{ color: 'red', fontSize: '13px', padding: '0 16px' }}>{error}</p>}

      <p className="notice">
        ⓘ רק משחקים שבהם אתה שחקן יכולים להירשם
      </p>

      <button className="submitBtn" onClick={handleSubmit} disabled={loading || members.length === 0}>
        {loading ? 'שומר...' : 'שמור תוצאה'}
      </button>
    </div>
  )
}

export default AddGame