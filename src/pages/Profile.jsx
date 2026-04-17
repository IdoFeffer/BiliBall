import { useNavigate } from 'react-router-dom'

const currentUser = {
  name: 'יוסי',
  wins: 12,
  losses: 4,
  memberSince: 'ינואר 2024',
}

const mockGames = [
  { id: 1, result: 'win', opponent: 'דני', date: 'היום, 21:30' },
  { id: 2, result: 'win', opponent: 'מור', date: 'אתמול, 20:15' },
  { id: 3, result: 'lose', opponent: 'דני', date: '15.4, 19:00' },
  { id: 4, result: 'win', opponent: 'מור', date: '14.4, 22:10' },
]

const mockRivals = [
  { name: 'דני', wins: 7, total: 10 },
  { name: 'מור', wins: 5, total: 6 },
]

function Profile() {
  const navigate = useNavigate()
  const winRate = Math.round((currentUser.wins / (currentUser.wins + currentUser.losses)) * 100)
  const score = currentUser.wins - currentUser.losses

  return (
    <div>
      <button onClick={() => navigate('/home')}>← חזרה</button>
      <h2>פרופיל</h2>

      <div>
        <span>{currentUser.name[0]}</span>
        <div>
          <p>{currentUser.name}</p>
          <p>חבר מאז {currentUser.memberSince}</p>
        </div>
      </div>

      <h3>סטטיסטיקות</h3>
      <div>
        <div><span>{currentUser.wins}</span><span>נצחונות</span></div>
        <div><span>{currentUser.losses}</span><span>הפסדים</span></div>
        <div><span>{winRate}%</span><span>אחוז נצחון</span></div>
        <div><span>{currentUser.wins + currentUser.losses}</span><span>סה"כ משחקים</span></div>
        <div><span>{score > 0 ? '+' : ''}{score}</span><span>מדד</span></div>
        <div><span>4</span><span>רצף נצחונות</span></div>
      </div>

      <h3>נגד כל שחקן</h3>
      {mockRivals.map(rival => (
        <div key={rival.name}>
          <span>{rival.name}</span>
          <span>{rival.wins}/{rival.total}</span>
        </div>
      ))}

      <h3>היסטוריית משחקים</h3>
      {mockGames.map(game => (
        <div key={game.id}>
          <span>{game.result === 'win' ? 'נצחון' : 'הפסד'}</span>
          <span>נגד {game.opponent}</span>
          <span>{game.date}</span>
        </div>
      ))}

      <button onClick={() => navigate('/h2h')}>ראש בראש</button>
    </div>
  )
}

export default Profile