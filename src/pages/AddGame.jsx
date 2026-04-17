import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

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
    <div>
      <button onClick={() => navigate('/home')}>← חזרה</button>
      <h2>הוספת משחק</h2>

      <p>תוצאה</p>
      <button
        onClick={() => setResult('win')}
        style={{ fontWeight: result === 'win' ? 'bold' : 'normal' }}
      >
        אני ניצחתי
      </button>
      <button
        onClick={() => setResult('lose')}
        style={{ fontWeight: result === 'lose' ? 'bold' : 'normal' }}
      >
        אני הפסדתי
      </button>

      <p>נגד מי?</p>
      <select
        value={opponent}
        onChange={(e) => setOpponent(e.target.value)}
      >
        {mockPlayers.map(player => (
          <option key={player.id} value={player.name}>
            {player.name}
          </option>
        ))}
      </select>

      <p>הערה (אופציונלי)</p>
      <input
        type="text"
        placeholder="משחק מטורף..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <p>רק משחקים שבהם אתה שחקן יכולים להירשם</p>

      <button onClick={handleSubmit}>שמור תוצאה</button>
    </div>
  )
}

export default AddGame