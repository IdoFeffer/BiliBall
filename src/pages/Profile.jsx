import { useNavigate } from 'react-router-dom'
import '../styles/Profile.scss'

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
    <div className="page">
      <header className="header">
        <button className="backBtn" onClick={() => navigate('/home')}>← חזרה</button>
        <h2 className="headerTitle">פרופיל</h2>
        <div style={{ width: 60 }} />
      </header>

      <div className="section">
        <div className="playerInfo">
          <div className="avatarLg">{currentUser.name[0]}</div>
          <div>
            <p className="playerName">{currentUser.name}</p>
            <p className="memberSince">חבר מאז {currentUser.memberSince}</p>
          </div>
        </div>
      </div>

      <div className="section">
        <p className="sectionTitle">סטטיסטיקות</p>
        <div className="metricsGrid">
          <div className="metricCard">
            <div className="metricVal pos">{currentUser.wins}</div>
            <div className="metricLabel">נצחונות</div>
          </div>
          <div className="metricCard">
            <div className="metricVal neg">{currentUser.losses}</div>
            <div className="metricLabel">הפסדים</div>
          </div>
          <div className="metricCard">
            <div className="metricVal">{winRate}%</div>
            <div className="metricLabel">אחוז נצחון</div>
          </div>
          <div className="metricCard">
            <div className="metricVal">{currentUser.wins + currentUser.losses}</div>
            <div className="metricLabel">סה"כ משחקים</div>
          </div>
          <div className="metricCard">
            <div className={`metricVal ${score >= 0 ? 'pos' : 'neg'}`}>
              {score > 0 ? '+' : ''}{score}
            </div>
            <div className="metricLabel">מדד</div>
          </div>
          <div className="metricCard">
            <div className="metricVal">4</div>
            <div className="metricLabel">רצף נצחונות</div>
          </div>
        </div>
      </div>

      <div className="section">
        <p className="sectionTitle">נגד כל שחקן</p>
        {mockRivals.map(rival => (
          <div key={rival.name} className="rivalRow">
            <div className="avatarSm">{rival.name[0]}</div>
            <span className="rivalName">{rival.name}</span>
            <div className="rivalBar">
              <div
                className="rivalBarFill"
                style={{ width: `${Math.round((rival.wins / rival.total) * 100)}%` }}
              />
            </div>
            <span className="rivalScore">{rival.wins}/{rival.total}</span>
          </div>
        ))}
      </div>

      <div className="section">
        <p className="sectionTitle">היסטוריית משחקים</p>
        {mockGames.map(game => (
          <div key={game.id} className="historyRow">
            <span className={`resultBadge ${game.result}`}>
              {game.result === 'win' ? 'נצחון' : 'הפסד'}
            </span>
            <span className="historyOpponent">נגד {game.opponent}</span>
            <span className="historyDate">{game.date}</span>
          </div>
        ))}
      </div>

      <button className="h2hBtn" onClick={() => navigate('/h2h')}>
        ראש בראש ↗
      </button>
    </div>
  )
}

export default Profile