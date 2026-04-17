import '../styles/Home.scss'
import { useNavigate } from 'react-router-dom'

const mockPlayers = [
  { id: 1, name: 'יוסי', wins: 12, losses: 4 },
  { id: 2, name: 'דני', wins: 9, losses: 6 },
  { id: 3, name: 'מור', wins: 5, losses: 8 },
  { id: 4, name: 'רון', wins: 3, losses: 9 },
]

const mockGames = [
  { id: 1, winner: 'יוסי', loser: 'דני', date: 'היום' },
  { id: 2, winner: 'דני', loser: 'מור', date: 'אתמול' },
  { id: 3, winner: 'יוסי', loser: 'רון', date: '15.4' },
]

const isLoggedIn = true
const hasLeague = false
const currentUser = 'יוסי'
const avatarColors = ['blue', 'green', 'amber', 'steel']

function Home() {
  const navigate = useNavigate()

  return (
    <div className="page">
      <nav className="nav">
        <div>
          <h1 className="navLogo">BiliBall 🎱</h1>
          {isLoggedIn && hasLeague && <p className="navLeague">ליגת המרתף</p>}
        </div>
        {isLoggedIn
          ? <div className="navAvatar">{currentUser[0]}</div>
          : <button className="loginBtn" onClick={() => navigate('/login')}>התחבר</button>
        }
      </nav>

      {isLoggedIn && !hasLeague && (
        <div className="noLeague">
          <p className="noLeagueIcon">🎱</p>
          <p className="noLeagueTitle">ברוך הבא ל-BiliBall!</p>
          <p className="noLeagueSub">צור ליגה חדשה או הצטרף לליגה קיימת</p>
          <button className="noLeagueBtn" onClick={() => navigate('/create-league')}>
            צור ליגה חדשה
          </button>
          <button className="noLeagueBtnSecondary" onClick={() => navigate('/join-league')}>
            הצטרף לליגה קיימת
          </button>
        </div>
      )}

      {(!isLoggedIn || hasLeague) && (
        <section className={`section ${!isLoggedIn ? 'lockedSection' : ''}`}>
          <h2 className="sectionTitle">לוח מובילים</h2>
          <div>
            {mockPlayers.map((player, index) => (
              <div key={player.id} className="playerRow">
                <span className={`rank ${index === 0 ? 'first' : ''}`}>{index + 1}</span>
                <div className={`avatar ${avatarColors[index]}`}>{player.name[0]}</div>
                <span className="playerName">
                  {isLoggedIn && currentUser === player.name && (
                    <span className="youBadge">את/ה</span>
                  )}
                  {player.name}
                </span>
                <div className="stats">
                  <div className="stat">
                    <div className="statVal pos">{player.wins}</div>
                    <div className="statLabel">נצ'</div>
                  </div>
                  <div className="stat">
                    <div className="statVal neg">{player.losses}</div>
                    <div className="statLabel">הפ'</div>
                  </div>
                  <div className="stat">
                    <div className={`statVal ${player.wins - player.losses >= 0 ? 'pos' : 'neg'}`}>
                      {player.wins - player.losses > 0 ? '+' : ''}{player.wins - player.losses}
                    </div>
                    <div className="statLabel">מדד</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!isLoggedIn && (
            <div className="lockedOverlay">
              <p>🔒</p>
              <p className="lockedTitle">התחבר לראות את הליגה</p>
              <button className="loginBtn" onClick={() => navigate('/login')}>התחבר</button>
            </div>
          )}
        </section>
      )}

      {isLoggedIn && hasLeague && (
        <section className="section">
          <h2 className="sectionTitle">משחקים אחרונים</h2>
          {mockGames.map(game => (
            <div key={game.id} className="recentRow">
              <div className={`avatar ${avatarColors[mockPlayers.findIndex(p => p.name === game.winner)]}`}>
                {game.winner[0]}
              </div>
              <span className="recentText">{game.winner} ניצח את {game.loser}</span>
              <span className="recentDate">{game.date}</span>
            </div>
          ))}
        </section>
      )}

      {isLoggedIn && hasLeague && (
        <nav className="bottomNav">
          <button className="navTab active">
            <span className="navTabIcon">🏠</span>
            בית
          </button>
          <button className="navCenter" onClick={() => navigate('/add-game')}>
            <span className="navCenterIcon">+</span>
            הוספת משחק
          </button>
          <button className="navTab" onClick={() => navigate('/profile')}>
            <span className="navTabIcon">👤</span>
            פרופיל
          </button>
        </nav>
      )}
    </div>
  )
}

export default Home