import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/AddGame.scss'

const mockPlayers = [
  { id: 1, name: 'דני' },
  { id: 2, name: 'מור' },
  { id: 3, name: 'רון' },
]

const currentUser = 'יוסי'

function AddGame() {
  const navigate = useNavigate()
  const [result, setResult] = useState('win')
  const [opponent, setOpponent] = useState(mockPlayers[0].name)
  const [note, setNote] = useState('')

  const handleSubmit = () => {
    const game = {
      winner: result === 'win' ? currentUser : opponent,
      loser: result === 'win' ? opponent : currentUser,
      note,
    }
    console.log('משחק נשמר:', game)
    navigate('/home')
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
        <select
          className="select"
          value={opponent}
          onChange={(e) => setOpponent(e.target.value)}
        >
          {mockPlayers.map(player => (
            <option key={player.id} value={player.name}>
              {player.name}
            </option>
          ))}
        </select>
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

      <p className="notice">
        ⓘ רק משחקים שבהם אתה שחקן יכולים להירשם
      </p>

      <button className="submitBtn" onClick={handleSubmit}>
        שמור תוצאה
      </button>
    </div>
  )
}

export default AddGame