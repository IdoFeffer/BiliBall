import '../styles/Home.scss'
import HomeSkeleton from '../components/HomeSkeleton'
import BottomNav from '../components/BottomNav'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { players, games, leagues } from '../api'

const BALL_COLORS = ['#f1c40f', '#1B4FD8', '#e74c3c', '#9b59b6', '#F19953', '#27ae60', '#2980b9', '#111']

function DotsRating({ wins, losses }) {
  const total = wins + losses
  const filled = total === 0 ? 0 : Math.round((wins / total) * 5)
  return (
    <span className="dotsRating">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < filled ? 'dotFilled' : 'dotEmpty'}>●</span>
      ))}
    </span>
  )
}

function Home({ toggleDark, darkMode }) {
  const navigate = useNavigate()
  const [leaguePlayers, setLeaguePlayers] = useState([])
  const [recentGames, setRecentGames] = useState([])
  const [totalGames, setTotalGames] = useState(0)
  const [loading, setLoading] = useState(true)
  const [openNote, setOpenNote] = useState(null)
  const [showLeagueDropdown, setShowLeagueDropdown] = useState(false)
  const [userRole, setUserRole] = useState('member')
  const [showConfirm, setShowConfirm] = useState(null)
  const [pendingGames, setPendingGames] = useState([])
  const [showPending, setShowPending] = useState(false)
  const [showInstall, setShowInstall] = useState(null)

  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const leagueId = localStorage.getItem('leagueId')
  const leagueName = localStorage.getItem('leagueName')
  const isLoggedIn = !!localStorage.getItem('token')
  const hasLeague = !!leagueId
  const userLeagues = JSON.parse(localStorage.getItem('userLeagues') || '[]')

  useEffect(() => {
    if (!isLoggedIn) return
    if (!hasLeague) { setLoading(false); return }

    const fetchData = async () => {
      try {
        const [playersRes, gamesRes, allLeaguesRes, membersRes] = await Promise.all([
          players.getLeaguePlayers(leagueId),
          games.getLeagueGames(leagueId),
          leagues.getAllLeagues(),
          leagues.getMembers(leagueId),
        ])
        setLeaguePlayers(playersRes.data)
        setTotalGames(gamesRes.data.length)
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

    const fetchPending = async () => {
      try {
        const pendingRes = await games.getPending(leagueId)
        setPendingGames(pendingRes.data)
      } catch (err) {
        console.error('pending error:', err)
      }
    }

    fetchData()
    fetchPending()
  }, [])

  const handleLogout = () => {
    localStorage.clear()
    window.location.href = '/login'
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

  const handleConfirmGame = async (gameId) => {
    try {
      await games.confirm(gameId)
      setPendingGames((prev) => prev.filter((g) => g.id !== gameId))
      window.location.reload()
    } catch (err) {
      alert('שגיאה באישור')
    }
  }

  const handleRejectGame = async (gameId) => {
    try {
      await games.reject(gameId)
      setPendingGames((prev) => prev.filter((g) => g.id !== gameId))
    } catch (err) {
      alert('שגיאה בדחייה')
    }
  }

  const getHoursLeft = (expiresAt) => {
    if (!expiresAt) return 24
    const diff = new Date(expiresAt + 'Z') - new Date()
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60)))
  }

  if (loading) return <HomeSkeleton />

  const leader = leaguePlayers[0]
  const leaderWinPct = leader && (leader.wins + leader.losses > 0)
    ? Math.round((leader.wins / (leader.wins + leader.losses)) * 100)
    : 0

  return (
    <div className="page">

      {/* ── HEADER ── */}
      <nav className="nav">
        <div className="navBall8" onClick={handleLogout}>
          <div className="ball8Avatar">
            <span className="ball8Inner">8</span>
          </div>
        </div>
        <div className="navCenter">
          <h1 className="navLogo">BiliBall</h1>
          {hasLeague && (
            <div className="leagueChip" onClick={() => setShowLeagueDropdown(!showLeagueDropdown)}>
              <span>🏆</span>
              <span>{leagueName}</span>
            </div>
          )}
        </div>
        <button className="navDarkBtn" onClick={toggleDark}>
          {darkMode ? '☀️' : '🌙'}
        </button>
      </nav>

      {/* league dropdown */}
      {showLeagueDropdown && (
        <div className="leagueDropdown">
          {userLeagues.map((league) => (
            <div
              key={league.id}
              className={`leagueOption ${league.id == leagueId ? 'active' : ''}`}
              onClick={() => switchLeague(league)}
            >
              <div className={`leagueDot ${league.id == leagueId ? 'active' : ''}`} />
              <span className="leagueOptionName">{league.name}</span>
              {league.id == leagueId && <span className="leagueCheck">✓</span>}
            </div>
          ))}
          <div className="leagueDivider" />
          <div className="leagueOption" onClick={() => { setShowLeagueDropdown(false); navigate('/join-league') }}>
            <span className="leaguePlus">→</span>
            <span className="leagueOptionName">הצטרף לליגה קיימת או צור חדשה</span>
          </div>
        </div>
      )}

      {/* pending banner */}
      {isLoggedIn && hasLeague && pendingGames.length > 0 && (
        <div className="pendingBanner" onClick={() => setShowPending(true)}>
          <span className="pendingBannerIcon">⏳</span>
          <div className="pendingBannerText">
            <p className="pendingBannerTitle">יש לך {pendingGames.length} משחקים לאישור</p>
            <p className="pendingBannerSub">לחץ לאישור או דחייה</p>
          </div>
          <span className="pendingBannerArrow">›</span>
        </div>
      )}

      {/* no league */}
      {isLoggedIn && !hasLeague && (
        <div className="noLeague">
          <p className="noLeagueIcon">🎱</p>
          <p className="noLeagueTitle">ברוך הבא ל-BiliBall!</p>
          <p className="noLeagueSub">צור ליגה חדשה או הצטרף לליגה קיימת</p>
          <button className="noLeagueBtn" onClick={() => navigate('/join-league')}>צור או הצטרף לליגה</button>
        </div>
      )}

      {isLoggedIn && hasLeague && (
        <div className="homeContent">

          {/* ── HERO CARD ── */}
          {leader && (
            <div className="heroCard" onClick={() => navigate(`/profile/${leader.id}`)}>
              <span className="heroCrown">👑</span>
              <div className="heroCardBody">
                <div className="heroLeft">
                  <div className="heroLetterAvatar">
                    {leader.avatar_url
                      ? <img src={leader.avatar_url} alt="" className="heroAvatarImg" />
                      : (leader.full_name?.[0] || leader.username?.[0])
                    }
                  </div>
                </div>
                <div className="heroRight">
                  <span className="heroName">
                    {leader.full_name || leader.username}
                    {user.id === leader.id && <span className="youBadgeHero">את/ה</span>}
                  </span>
                  <span className="heroLabel">מוביל/ה את הליגה</span>
                </div>
              </div>
              <div className="heroStats">
                <div className="heroStatBox">
                  <span className="heroStatVal">{leaderWinPct}%</span>
                  <span className="heroStatLabel">אחוז זכייה</span>
                </div>
                <div className="heroStatBox">
                  <span className="heroStatVal heroStatNeg">{leader.losses}</span>
                  <span className="heroStatLabel">הפסדים</span>
                </div>
                <div className="heroStatBox">
                  <span className="heroStatVal heroStatPos">{leader.wins}</span>
                  <span className="heroStatLabel">נצחונות</span>
                </div>
              </div>
            </div>
          )}

          {/* ── LEADERBOARD ── */}
          <div className="leaderCard">
            <div className="leaderHead">
              <span className="leaderHeadName">שחקן</span>
              <span className="leaderHeadStat">נצ'</span>
              <span className="leaderHeadStat">הפ'</span>
              <span className="leaderHeadStat">מד'</span>
            </div>
            {leaguePlayers.slice(1).map((player, index) => {
              const isMe = user.id === player.id
              const score = player.wins - player.losses
              const avatarColor = BALL_COLORS[(index + 1) % BALL_COLORS.length]
              const rank = index + 2
              return (
                <div key={player.id} className="leaderRow" onClick={() => navigate(`/profile/${player.id}`)}>
                  <div className="leaderRank">{rank}</div>
                  <div className="leaderInfo">
                    {player.avatar_url
                      ? <img src={player.avatar_url} alt="" className="leaderAvatarImg" />
                      : <div className="leaderAvatar" style={{ background: avatarColor }}>
                          {(player.full_name || player.username)?.[0]?.toUpperCase()}
                        </div>
                    }
                    <span className="leaderName">
                      {player.full_name || player.username}
                      {isMe && <span className="youBadge">את/ה</span>}
                    </span>
                  </div>
                  <span className="leaderStat statPos">{player.wins}</span>
                  <span className="leaderStat statNeg">{player.losses}</span>
                  <span className={`leaderStat ${score >= 0 ? 'statPos' : 'statNeg'}`}>
                    {score > 0 ? '+' : ''}{score}
                  </span>
                </div>
              )
            })}
          </div>

          {/* ── RECENT GAMES ── */}
          <div className="recentCard">
            <div className="recentHeader">
              <span className="recentTotal">{totalGames} סה״כ</span>
              <h2 className="recentTitle">משחקים אחרונים</h2>
            </div>
            {recentGames.length === 0 && <p className="recentEmpty">אין משחקים עדיין</p>}
            {recentGames.map((game) => (
              <div key={game.id}>
                <div className="recentRow">
                  <span className="recentDate">
                    {new Date(game.played_at).toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit' })}
                  </span>
                  {(game.winner_score > 0 || game.loser_score > 0) && (
                    <span className="recentScore">
                      <span className="scoreWin">{game.winner_score}</span>
                      <span className="scoreSep">-</span>
                      <span className="scoreLoss">{game.loser_score}</span>
                    </span>
                  )}
                  <span className="recentText">
                    {game.winner_score === game.loser_score
                      ? `תיקו בין ${game.winner_name} ל-${game.loser_name}`
                      : `${game.winner_name} ניצח את ${game.loser_name}`}
                  </span>
                  <div className="recentAvatar">{game.winner_name?.[0]}</div>
                  {game.note && (
                    <span className="recentNote" onClick={(e) => { e.stopPropagation(); setOpenNote(openNote === game.id ? null : game.id) }}>💬</span>
                  )}
                </div>
                {openNote === game.id && game.note && <div className="noteTooltip">{game.note}</div>}
              </div>
            ))}
          </div>

          {/* ── INVITE ── */}
          <div className="section">
            <h2 className="sectionTitle">הזמן לליגה</h2>
            <div className="inviteCode">
              <div>
                <p className="inviteLabel">קוד הצטרפות</p>
                <p className="inviteCodeText">{localStorage.getItem('leagueCode')}</p>
              </div>
              <button className="inviteCopyBtn" onClick={() => { navigator.clipboard.writeText(localStorage.getItem('leagueCode')); alert('הקוד הועתק!') }}>העתק</button>
            </div>
            <button className="inviteShareBtn" onClick={() => {
              const code = localStorage.getItem('leagueCode')
              if (navigator.share) {
                navigator.share({ title: 'הצטרף ל-BiliBall', text: `הצטרף לליגה שלנו עם הקוד: ${code}` })
              } else {
                navigator.clipboard.writeText(`הצטרף לליגה שלנו עם הקוד: ${code}`)
                alert('הועתק!')
              }
            }}>🔗 שתף הזמנה</button>
          </div>

          {/* ── INSTALL ── */}
          <div className="section">
            <h2 className="sectionTitle">התקן כאפליקציה</h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="installBtn" onClick={() => setShowInstall('ios')}>
                <span style={{ fontSize: 28 }}></span>
                <span className="installBtnLabel">iPhone</span>
                <span className="installBtnSub">Safari</span>
              </button>
              <button className="installBtn" onClick={() => setShowInstall('android')}>
                <span style={{ fontSize: 28 }}>🤖</span>
                <span className="installBtnLabel">Android</span>
                <span className="installBtnSub">Chrome</span>
              </button>
            </div>
          </div>

          {/* ── LEAVE / DELETE ── */}
          <div style={{ padding: '4px 16px 24px' }}>
            {userRole === 'admin' ? (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="leaveBtn" onClick={() => setShowConfirm('leave')}>↩ עזוב ליגה</button>
                <button className="deleteBtn" onClick={() => setShowConfirm('delete')}>✕ מחק ליגה</button>
              </div>
            ) : (
              <button className="deleteBtnFull" onClick={() => setShowConfirm('leave')}>↩ עזוב ליגה</button>
            )}
          </div>

        </div>
      )}

      {/* ── BOTTOM NAV ── */}
      {isLoggedIn && hasLeague && <BottomNav active="home" />}

      {/* ── CONFIRM MODAL ── */}
      {showConfirm && (
        <div className="confirmOverlay" onClick={() => setShowConfirm(null)}>
          <div className="confirmSheet" onClick={(e) => e.stopPropagation()}>
            <p className="confirmTitle">{showConfirm === 'leave' ? `עזוב את ${leagueName}?` : `מחק את ${leagueName}?`}</p>
            <p className="confirmSub">{showConfirm === 'leave' ? 'תוכל להצטרף מחדש עם קוד הזמנה. המשחקים שלך יישמרו.' : 'כל החברים יוסרו מהליגה. המשחקים יישמרו.'}</p>
            <button className={showConfirm === 'leave' ? 'confirmBtnWarn' : 'confirmBtnDanger'} onClick={handleLeaveOrDelete}>
              {showConfirm === 'leave' ? 'עזוב ליגה' : 'מחק ליגה לצמיתות'}
            </button>
            <button className="confirmBtnCancel" onClick={() => setShowConfirm(null)}>ביטול</button>
          </div>
        </div>
      )}

      {/* ── PENDING MODAL ── */}
      {showPending && (
        <div className="confirmOverlay" onClick={() => setShowPending(false)}>
          <div className="confirmSheet" onClick={(e) => e.stopPropagation()}>
            <p className="confirmTitle">משחקים ממתינים לאישור</p>
            {pendingGames.map((game) => (
              <div key={game.id} className="pendingGameCard">
                <p className="pendingGameInfo">
                  {game.winner_score === game.loser_score
                    ? `${game.winner_name} סוען שהמשחק נגמר תיקו`
                    : `${game.winner_name} טוען שניצח אותך`}
                </p>
                {(game.winner_score > 0 || game.loser_score > 0) && (
                  <p className="pendingGameScore">{game.winner_score} : {game.loser_score}</p>
                )}
                <p className="pendingGameSub">פג תוקף בעוד {getHoursLeft(game.expires_at)} שעות</p>
                <div className="pendingGameActions">
                  <button className="pendingConfirmBtn" onClick={() => handleConfirmGame(game.id)}>✓ אשר</button>
                  <button className="pendingRejectBtn" onClick={() => handleRejectGame(game.id)}>✕ דחה</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── iOS INSTALL ── */}
      {showInstall === 'ios' && (
        <div className="confirmOverlay" onClick={() => setShowInstall(null)}>
          <div className="confirmSheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheetHandle" />
            <p className="confirmTitle"> הוסף ל-iPhone</p>
            <p className="confirmSub">פתח באפליקציית Safari בלבד</p>
            <div className="installSteps">
              <div className="installStep"><div className="installStepNum">1</div><div className="installStepText">לחץ על שלוש הנקודות <strong>⋯</strong> בסרגל Safari</div></div>
              <div className="installStep"><div className="installStepNum">2</div><div className="installStepText">לחץ על <strong>Share</strong> 📤</div></div>
              <div className="installStep"><div className="installStepNum">3</div><div className="installStepText">גלול ובחר <strong>Add to Home Screen</strong> ➕</div></div>
              <div className="installStep"><div className="installStepNum">4</div><div className="installStepText">לחץ <strong>Add</strong> — פתח כ-Web App 🎉</div></div>
            </div>
            <p className="installNote">⚠️ עובד רק עם Safari — לא Chrome</p>
          </div>
        </div>
      )}

      {/* ── Android INSTALL ── */}
      {showInstall === 'android' && (
        <div className="confirmOverlay" onClick={() => setShowInstall(null)}>
          <div className="confirmSheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheetHandle" />
            <p className="confirmTitle">🤖 הוסף לאנדרואיד</p>
            <p className="confirmSub">פתח ב-Chrome</p>
            <div className="installSteps">
              <div className="installStep"><div className="installStepNum">1</div><div className="installStepText">לחץ על שלוש הנקודות <strong>⋮</strong> בפינה הימנית העליונה</div></div>
              <div className="installStep"><div className="installStepNum">2</div><div className="installStepText">בחר <strong>הוסף למסך הבית</strong> 📲</div></div>
              <div className="installStep"><div className="installStepNum">3</div><div className="installStepText">לחץ <strong>הוסף</strong> — האייקון יופיע על המסך 🎉</div></div>
            </div>
            <p className="installNote">עובד עם Chrome, Edge, Samsung Browser</p>
          </div>
        </div>
      )}

    </div>
  )
}

export default Home
