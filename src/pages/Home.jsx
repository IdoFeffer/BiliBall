import '../styles/Home.scss'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { players, games } from '../api'

const avatarColors = ['blue', 'green', 'amber', 'steel']

function Home() {
  const navigate = useNavigate()
  const [leaguePlayers, setLeaguePlayers] = useState([])
  const [recentGames, setRecentGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [openNote, setOpenNote] = useState(null)

  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const leagueId = localStorage.getItem('leagueId')
  const leagueName = localStorage.getItem('leagueName')
  const isLoggedIn = !!localStorage.getItem('token')
  const hasLeague = !!leagueId

  useEffect(() => {
    if (!isLoggedIn) return
    if (!hasLeague) {
      setLoading(false)
      return
    }
    const fetchData = async () => {
      try {
        const [playersRes, gamesRes] = await Promise.all([
          players.getLeaguePlayers(leagueId),
          games.getLeagueGames(leagueId),
        ])
        setLeaguePlayers(playersRes.data)
        setRecentGames(gamesRes.data.slice(0, 5))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  if (loading) return <div style={{ padding: 20 }}>טוען...</div>

  return (
    <div className="page">
<nav className="nav">
  <div className="navAvatar" onClick={handleLogout} style={{ cursor: 'pointer' }}>
    {user.full_name?.[0] || user.username?.[0]}
  </div>
  <div style={{ textAlign: 'center' }}>
    <h1 className="navLogo">BiliBall 🎱</h1>
  </div>
  <div />
</nav>

      {isLoggedIn && hasLeague && (
        <p
          style={{
            textAlign: 'center',
            fontSize: '12px',
            color: '#999',
            padding: '8px 0 0',
          }}
        >
          {leagueName}
        </p>
      )}

      {isLoggedIn && !hasLeague && (
        <div className="noLeague">
          <p className="noLeagueIcon">🎱</p>
          <p className="noLeagueTitle">ברוך הבא ל-BiliBall!</p>
          <p className="noLeagueSub">צור ליגה חדשה או הצטרף לליגה קיימת</p>
          <button
            className="noLeagueBtn"
            onClick={() => navigate('/create-league')}
          >
            צור ליגה חדשה
          </button>
          <button
            className="noLeagueBtnSecondary"
            onClick={() => navigate('/join-league')}
          >
            הצטרף לליגה קיימת
          </button>
        </div>
      )}

      {(!isLoggedIn || hasLeague) && (
        <section className={`section ${!isLoggedIn ? 'lockedSection' : ''}`}>
          <h2 className="sectionTitle">לוח מובילים</h2>
          <div>
            {leaguePlayers.map((player, index) => (
              <div
                key={player.id}
                className="playerRow"
                onClick={() => navigate(`/profile/${player.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <span className={`rank ${index === 0 ? 'first' : ''}`}>
                  {index + 1}
                </span>
                <div
                  className={`avatar ${avatarColors[index % avatarColors.length]}`}
                >
                  {player.full_name?.[0] || player.username?.[0]}
                </div>
                <span className="playerName">
                  {user.id === player.id && (
                    <span className="youBadge">את/ה</span>
                  )}
                  {player.full_name || player.username}
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
                    <div
                      className={`statVal ${player.wins - player.losses >= 0 ? 'pos' : 'neg'}`}
                    >
                      {player.wins - player.losses > 0 ? '+' : ''}
                      {player.wins - player.losses}
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
              <button className="loginBtn" onClick={() => navigate('/login')}>
                התחבר
              </button>
            </div>
          )}
        </section>
      )}

      {isLoggedIn && hasLeague && (
        <section className="section">
          <h2 className="sectionTitle">משחקים אחרונים</h2>
          {recentGames.length === 0 && (
            <p
              style={{
                fontSize: '13px',
                color: '#999',
                textAlign: 'center',
                padding: '16px 0',
              }}
            >
              אין משחקים עדיין
            </p>
          )}
          {recentGames.map((game, index) => (
            <div key={game.id}>
              <div className="recentRow">
                <div
                  className={`avatar ${avatarColors[index % avatarColors.length]}`}
                >
                  {game.winner_name?.[0]}
                </div>
                <span className="recentText">
                  {game.winner_name} ניצח את {game.loser_name}
                </span>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  {game.note && (
                    <span
                      style={{ cursor: 'pointer', fontSize: '14px' }}
                      onClick={() =>
                        setOpenNote(openNote === game.id ? null : game.id)
                      }
                    >
                      💬
                    </span>
                  )}
                  <span className="recentDate">
                    {new Date(game.played_at).toLocaleDateString('he-IL')}
                  </span>
                </div>
              </div>
              {openNote === game.id && game.note && (
                <div className="noteTooltip">{game.note}</div>
              )}
            </div>
          ))}
        </section>
      )}

{isLoggedIn && hasLeague && (
  <section className="section">
    <h2 className="sectionTitle">הזמן לליגה</h2>
    <div className="inviteCode">
      <div>
        <p className="inviteLabel">קוד הצטרפות</p>
        <p className="inviteCodeText">{localStorage.getItem('leagueCode')}</p>
      </div>
      <button
        className="inviteCopyBtn"
        onClick={() => {
          navigator.clipboard.writeText(localStorage.getItem('leagueCode'))
          alert('הקוד הועתק!')
        }}
      >
        העתק
      </button>
    </div>
    <button
      className="inviteShareBtn"
      onClick={() => {
        const code = localStorage.getItem('leagueCode')
        if (navigator.share) {
          navigator.share({
            title: 'הצטרף ל-BiliBall',
            text: `הצטרף לליגה שלנו עם הקוד: ${code}`,
          })
        } else {
          navigator.clipboard.writeText(`הצטרף לליגה שלנו עם הקוד: ${code}`)
          alert('הקישור הועתק!')
        }
      }}
    >
      🔗 שתף הזמנה
    </button>
  </section>
)}
    </div>
  )
}

export default Home
