import '../styles/Home.scss'
import HomeSkeleton from '../components/HomeSkeleton'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { players, games, leagues } from '../api'

const avatarColors = ['blue', 'green', 'amber', 'steel']

function Home() {
  const navigate = useNavigate()
  const [leaguePlayers, setLeaguePlayers] = useState([])
  const [recentGames, setRecentGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [openNote, setOpenNote] = useState(null)
  const [showLeagueDropdown, setShowLeagueDropdown] = useState(false)
  const [userRole, setUserRole] = useState('member')
  const [showConfirm, setShowConfirm] = useState(null)

  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const leagueId = localStorage.getItem('leagueId')
  const leagueName = localStorage.getItem('leagueName')
  const isLoggedIn = !!localStorage.getItem('token')
  const hasLeague = !!leagueId
  const userLeagues = JSON.parse(localStorage.getItem('userLeagues') || '[]')

  useEffect(() => {
    if (!isLoggedIn) return
    if (!hasLeague) {
      setLoading(false)
      return
    }
    const fetchData = async () => {
      try {
        const [playersRes, gamesRes, allLeaguesRes, membersRes] =
          await Promise.all([
            players.getLeaguePlayers(leagueId),
            games.getLeagueGames(leagueId),
            leagues.getAllLeagues(),
            leagues.getMembers(leagueId),
          ])
        setLeaguePlayers(playersRes.data)
        setRecentGames(gamesRes.data.slice(0, 5))
        localStorage.setItem('userLeagues', JSON.stringify(allLeaguesRes.data))
        const me = membersRes.data.find((m) => m.id === user.id)
        if (me) setUserRole(me.role)
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

  const switchLeague = (league) => {
    localStorage.setItem('leagueId', league.id)
    localStorage.setItem('leagueName', league.name)
    localStorage.setItem('leagueCode', league.invite_code)
    setShowLeagueDropdown(false)
    window.location.reload()
  }

  const handleLeaveOrDelete = async () => {
    try {
      if (showConfirm === 'leave') {
        await leagues.leave(leagueId)
      } else {
        await leagues.deleteLeague(leagueId)
      }
      localStorage.removeItem('leagueId')
      localStorage.removeItem('leagueName')
      localStorage.removeItem('leagueCode')
      const allRes = await leagues.getAllLeagues()
      const remaining = allRes.data
      if (remaining.length > 0) {
        localStorage.setItem('leagueId', remaining[0].id)
        localStorage.setItem('leagueName', remaining[0].name)
        localStorage.setItem('leagueCode', remaining[0].invite_code)
        localStorage.setItem('userLeagues', JSON.stringify(remaining))
      } else {
        localStorage.removeItem('userLeagues')
      }
      window.location.reload()
    } catch (err) {
      alert(err.response?.data?.error || 'משהו השתבש')
    }
  }

  if (loading) return <HomeSkeleton />
  
  return (
    <div className="page">
      <nav className="nav">
        <div
          className="navAvatar"
          onClick={handleLogout}
          style={{ cursor: 'pointer' }}
        >
          {user.full_name?.[0] || user.username?.[0]}
        </div>
        <div style={{ textAlign: 'center' }}>
          <h1 className="navLogo">BiliBall 🎱</h1>
          {hasLeague && (
            <div
              className="leagueChip"
              onClick={() => setShowLeagueDropdown(!showLeagueDropdown)}
            >
              <span>{leagueName}</span>
              <span className="leagueChevron">
                {showLeagueDropdown ? '▴' : '▾'}
              </span>
            </div>
          )}
        </div>
        <div />
      </nav>

      {showLeagueDropdown && (
        <div className="leagueDropdown">
          {userLeagues.map((league) => (
            <div
              key={league.id}
              className={`leagueOption ${league.id == leagueId ? 'active' : ''}`}
              onClick={() => switchLeague(league)}
            >
              <div
                className={`leagueDot ${league.id == leagueId ? 'active' : ''}`}
              />
              <span className="leagueOptionName">{league.name}</span>
              {league.id == leagueId && <span className="leagueCheck">✓</span>}
            </div>
          ))}
          <div className="leagueDivider" />
          <div
            className="leagueOption"
            onClick={() => {
              setShowLeagueDropdown(false)
              navigate('/join-league')
            }}
          >
            <span className="leaguePlus">→</span>
            <span className="leagueOptionName">
              הצטרף לליגה קיימת או צור חדשה
            </span>
          </div>
        </div>
      )}

      {isLoggedIn && !hasLeague && (
        <div className="noLeague">
          <p className="noLeagueIcon">🎱</p>
          <p className="noLeagueTitle">ברוך הבא ל-BiliBall!</p>
          <p className="noLeagueSub">צור ליגה חדשה או הצטרף לליגה קיימת</p>
          <button
            className="noLeagueBtn"
            onClick={() => navigate('/join-league')}
          >
            צור או הצטרף לליגה
          </button>
        </div>
      )}

      {(!isLoggedIn || hasLeague) && (
        <section className={`section ${!isLoggedIn ? 'lockedSection' : ''}`}>
          <h2 className="sectionTitle">לוח מובילים</h2>
          <div>
            {leaguePlayers.map((player, index) => {
              const isMe = user.id === player.id
              const score = player.wins - player.losses
              const isFirst = index === 0

              if (isFirst) {
                return (
                  <div
                    key={player.id}
                    className="playerRowFirst"
                    onClick={() => navigate(`/profile/${player.id}`)}
                  >
                    <span className="rankFirst">1</span>
                    <div className="avatarFirst">
                      {player.full_name?.[0] || player.username?.[0]}
                    </div>
                    <span className="playerNameFirst">
                      {player.full_name || player.username}
                      {isMe && <span className="youBadgeFirst">את/ה</span>}
                    </span>
                    <div className="statsFirst">
                      <div className="stat">
                        <div className="statValFirst pos">{player.wins}</div>
                        <div className="statLabelFirst">נצ'</div>
                      </div>
                      <div className="stat">
                        <div className="statValFirst neg">{player.losses}</div>
                        <div className="statLabelFirst">הפ'</div>
                      </div>
                      <div className="stat">
                        <div
                          className={`statValFirst ${score >= 0 ? 'pos' : 'neg'}`}
                        >
                          {score > 0 ? '+' : ''}
                          {score}
                        </div>
                        <div className="statLabelFirst">מדד</div>
                      </div>
                    </div>
                  </div>
                )
              }

              return (
                <div
                  key={player.id}
                  className="playerRow"
                  onClick={() => navigate(`/profile/${player.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="rank">{index + 1}</span>
                  <div
                    className={`avatar ${avatarColors[index % avatarColors.length]}`}
                  >
                    {player.full_name?.[0] || player.username?.[0]}
                  </div>
                  <span className="playerName">
                    {player.full_name || player.username}
                    {isMe && <span className="youBadge">את/ה</span>}
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
                      <div className={`statVal ${score >= 0 ? 'pos' : 'neg'}`}>
                        {score > 0 ? '+' : ''}
                        {score}
                      </div>
                      <div className="statLabel">מדד</div>
                    </div>
                  </div>
                </div>
              )
            })}
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
        <button className="h2hBtn" onClick={() => navigate('/h2h')}>
          ראש בראש ↗
        </button>
      )}

      {isLoggedIn && hasLeague && (
        <section className="section">
          <h2 className="sectionTitle">הזמן לליגה</h2>
          <div className="inviteCode">
            <div>
              <p className="inviteLabel">קוד הצטרפות</p>
              <p className="inviteCodeText">
                {localStorage.getItem('leagueCode')}
              </p>
            </div>
            <button
              className="inviteCopyBtn"
              onClick={() => {
                navigator.clipboard.writeText(
                  localStorage.getItem('leagueCode'),
                )
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
                navigator.clipboard.writeText(
                  `הצטרף לליגה שלנו עם הקוד: ${code}`,
                )
                alert('הועתק!')
              }
            }}
          >
            🔗 שתף הזמנה
          </button>
        </section>
      )}

      {isLoggedIn && hasLeague && (
        <div style={{ padding: '12px 16px' }}>
          {userRole === 'admin' ? (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className="leaveBtn"
                onClick={() => setShowConfirm('leave')}
              >
                ↩ עזוב ליגה
              </button>
              <button
                className="deleteBtn"
                onClick={() => setShowConfirm('delete')}
              >
                ✕ מחק ליגה
              </button>
            </div>
          ) : (
            <button
              className="deleteBtnFull"
              onClick={() => setShowConfirm('leave')}
            >
              ↩ עזוב ליגה
            </button>
          )}
        </div>
      )}

      {showConfirm && (
        <div className="confirmOverlay" onClick={() => setShowConfirm(null)}>
          <div className="confirmSheet" onClick={(e) => e.stopPropagation()}>
            <p className="confirmTitle">
              {showConfirm === 'leave'
                ? `עזוב את ${leagueName}?`
                : `מחק את ${leagueName}?`}
            </p>
            <p className="confirmSub">
              {showConfirm === 'leave'
                ? 'תוכל להצטרף מחדש עם קוד הזמנה. המשחקים שלך יישמרו.'
                : 'כל החברים יוסרו מהליגה. המשחקים יישמרו.'}
            </p>
            <button
              className={
                showConfirm === 'leave' ? 'confirmBtnWarn' : 'confirmBtnDanger'
              }
              onClick={handleLeaveOrDelete}
            >
              {showConfirm === 'leave' ? 'עזוב ליגה' : 'מחק ליגה לצמיתות'}
            </button>
            <button
              className="confirmBtnCancel"
              onClick={() => setShowConfirm(null)}
            >
              ביטול
            </button>
          </div>
        </div>
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
