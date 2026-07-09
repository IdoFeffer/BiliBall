import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import '../styles/Profile.scss'
import { players, games, upload } from '../api'
import ProfileSkeleton from '../components/ProfileSkeleton'
import BottomNav from '../components/BottomNav'
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'https://biliball.onrender.com/api'

function computeStreak(gameList) {
  if (!gameList || gameList.length === 0) return { type: null, count: 0 }
  const first = gameList[0]
  if (first.winner_score === first.loser_score) return { type: null, count: 0 }
  const streakType = first.result
  let count = 0
  for (const g of gameList) {
    if (g.winner_score === g.loser_score) break
    if (g.result === streakType) count++
    else break
  }
  return { type: streakType, count }
}

function Profile({ toggleDark }) {
  const { userId } = useParams()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [openNote, setOpenNote] = useState(null)
  const [showEditName, setShowEditName] = useState(false)
  const [newName, setNewName] = useState('')
  const [savingName, setSavingName] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [displayPct, setDisplayPct] = useState(0)

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
  const leagueId = localStorage.getItem('leagueId')
  const targetUserId = userId || currentUser.id
  const isOwnProfile = !userId || parseInt(userId) === currentUser.id

  useEffect(() => {
    if (!document.getElementById('profile-fonts')) {
      const link = document.createElement('link')
      link.id = 'profile-fonts'
      link.rel = 'stylesheet'
      link.href =
        'https://fonts.googleapis.com/css2?family=Heebo:wght@400;700;800;900&family=Assistant:wght@400;600;700&family=Sora:wght@800;900&display=swap'
      document.head.appendChild(link)
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, avatarRes] = await Promise.all([
          players.getStats(targetUserId, leagueId),
          upload.getAvatar(targetUserId).catch(() => ({ data: {} })),
        ])
        setStats(statsRes.data)
        if (avatarRes.data.avatar_url) setAvatarUrl(avatarRes.data.avatar_url)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [targetUserId])

  useEffect(() => {
    if (!stats) return
    const winPct =
      stats.wins + stats.losses > 0
        ? Math.round((stats.wins / (stats.wins + stats.losses)) * 100)
        : 0
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayPct(winPct)
      return
    }
    let raf
    const start = performance.now()
    const duration = 900
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1)
      setDisplayPct(Math.round(t * winPct))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [stats])

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploadingAvatar(true)
    try {
      const formData = new FormData()
      formData.append('avatar', file)
      const res = await upload.uploadAvatar(formData)
      setAvatarUrl(res.data.avatar_url)
    } catch {
      alert('שגיאה בהעלאת התמונה')
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleSaveName = async () => {
    if (!newName.trim()) return
    setSavingName(true)
    try {
      const token = localStorage.getItem('token')
      await axios.patch(
        `${BASE_URL}/auth/update-name`,
        { full_name: newName.trim() },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      const updatedUser = { ...currentUser, full_name: newName.trim() }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setStats((prev) => ({
        ...prev,
        user: { ...prev.user, full_name: newName.trim() },
      }))
      setShowEditName(false)
    } catch {
      alert('שגיאה בעדכון השם')
    } finally {
      setSavingName(false)
    }
  }

  if (loading) return <ProfileSkeleton />
  if (!stats) return <div style={{ padding: 20 }}>שגיאה בטעינה</div>

  const frameDiff = stats.games.reduce((acc, g) => {
    if (g.winner_score === g.loser_score) return acc
    return (
      acc +
      (g.result === 'win'
        ? g.winner_score - g.loser_score
        : g.loser_score - g.winner_score)
    )
  }, 0)

  const streak = computeStreak(stats.games)
  const streakLabel =
    streak.count >= 1
      ? streak.type === 'win'
        ? `🔥 ${streak.count}`
        : `❄️ ${streak.count}`
      : '–'

  return (
    <div className="profilePage">
      <div className="profileDarkBg" />

      <header className="profileTopBar">
        {toggleDark && (
          <button
            className="profileDarkToggle"
            onClick={toggleDark}
            aria-label="מצב לילה"
          >
            🌙
          </button>
        )}
      </header>

      <div className="profileHeaderZone">
        <div className="profileAvatarWrap">
          {avatarUrl ? (
            <img src={avatarUrl} alt="avatar" className="profileAvatarImg" />
          ) : (
            <div className="profileAvatarInitial">
              {stats.user.full_name?.[0]}
            </div>
          )}
          {isOwnProfile && (
            <label className="profileAvatarEdit" title="שנה תמונה">
              ✏️
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleAvatarChange}
                disabled={uploadingAvatar}
              />
            </label>
          )}
        </div>

        <div className="profileNameRow">
          <h1 className="profileName">{stats.user.full_name}</h1>
          {isOwnProfile && (
            <button
              className="profileEditNameBtn"
              onClick={() => {
                setNewName(stats.user.full_name)
                setShowEditName(true)
              }}
            >
              ✏ ערוך
            </button>
          )}
        </div>
        <p className="profileHandle">@{stats.user.username}</p>
      </div>

      <div className="profileBody">
        {/* Win-rate hero card */}
        <div className="pheroCard">
          <div className="pheroRingSection">
            <div className="pRingOuter" style={{ '--pct': `${displayPct}%` }}>
              <div className="pRingInner">
                <span className="pRingPct">{displayPct}%</span>
              </div>
            </div>
            <p className="pRingLabel">אחוז ניצחון</p>
          </div>

          <div className="pheroDivider" />

          <div className="pheroFrameSection">
            <span
              className={`pFrameVal ${frameDiff > 0 ? 'pos' : frameDiff < 0 ? 'neg' : 'zero'}`}
            >
              {frameDiff > 0 ? '+' : ''}
              {frameDiff}
            </span>
            <span className="pFrameLabel">מד'</span>
          </div>
        </div>

        {/* Three-stat row */}
        <div className="pStatRow">
          <div className="pStatCell">
            <span className="pStatVal win">{stats.wins}</span>
            <span className="pStatLabel">נצחונות</span>
          </div>
          <div className="pStatCell">
            <span className="pStatVal lose">{stats.losses}</span>
            <span className="pStatLabel">הפסדים</span>
          </div>
          <div className="pStatCell">
            <span className="pStatVal">{streakLabel}</span>
            <span className="pStatLabel">רצף</span>
          </div>
        </div>

        {/* Match history */}
        <div className="pHistoryCard">
          <h3 className="pHistoryTitle">היסטוריית משחקים</h3>
          {stats.games.length === 0 && (
            <p className="pHistoryEmpty">אין משחקים עדיין</p>
          )}
          {stats.games.map((game) => {
            const isDraw = game.winner_score === game.loser_score
            const badgeClass = isDraw ? 'draw' : game.result
            const label = isDraw
              ? 'תיקו'
              : game.result === 'win'
                ? 'נצחון'
                : 'הפסד'
            const text = isDraw
              ? `תיקו מול ${game.opponent_name}`
              : game.result === 'win'
                ? `ניצחת את ${game.opponent_name}`
                : `הפסדת ל${game.opponent_name}`
            const hasScore = game.winner_score > 0 || game.loser_score > 0
            const scoreText = hasScore
              ? isDraw
                ? `${game.winner_score}:${game.loser_score}`
                : game.result === 'win'
                  ? `${game.winner_score}:${game.loser_score}`
                  : `${game.loser_score}:${game.winner_score}`
              : null

            return (
              <div key={game.id}>
                <div className="pHistoryRow">
                  <span className={`pHBadge ${badgeClass}`}>{label}</span>
                  <span className="pHText">{text}</span>
                  {scoreText && (
                    <span className="pHScore">{scoreText}</span>
                  )}
                  <div className="pHActions">
                    {game.note && (
                      <span
                        className="pHIcon"
                        onClick={() =>
                          setOpenNote(openNote === game.id ? null : game.id)
                        }
                      >
                        💬
                      </span>
                    )}
                    <span className="pHDate">
                      {new Date(game.played_at).toLocaleDateString('he-IL')}
                    </span>
                    {isOwnProfile && (
                      <span
                        className="pHIcon"
                        style={{ opacity: 0.4 }}
                        onClick={async () => {
                          if (!window.confirm('למחוק את המשחק?')) return
                          try {
                            await games.delete(game.id)
                            setStats((prev) => ({
                              ...prev,
                              games: prev.games.filter((g) => g.id !== game.id),
                            }))
                          } catch {
                            alert('שגיאה במחיקה')
                          }
                        }}
                      >
                        🗑
                      </span>
                    )}
                  </div>
                </div>
                {openNote === game.id && game.note && (
                  <div className="pNoteTooltip">
                    <span>{game.note}</span>
                    {isOwnProfile && (
                      <span
                        className="pNoteDelete"
                        onClick={async () => {
                          try {
                            await games.deleteNote(game.id)
                            setStats((prev) => ({
                              ...prev,
                              games: prev.games.map((g) =>
                                g.id === game.id ? { ...g, note: null } : g,
                              ),
                            }))
                            setOpenNote(null)
                          } catch {
                            alert('שגיאה במחיקה')
                          }
                        }}
                      >
                        ✕
                      </span>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <BottomNav active="profile" />

      {/* Edit name modal */}
      {showEditName && (
        <div className="pOverlay" onClick={() => setShowEditName(false)}>
          <div className="pSheet" onClick={(e) => e.stopPropagation()}>
            <div className="pSheetHandle" />
            <p className="pSheetTitle">שנה שם</p>
            <p className="pSheetSub">השם יעודכן בכל הליגות</p>
            <input
              className="pSheetInput"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="הכנס שם חדש"
              autoFocus
            />
            <button
              className="pSheetBtn pSheetBtnPrimary"
              style={{ background: newName.trim() ? '#2563EB' : '#ccc' }}
              disabled={!newName.trim() || savingName}
              onClick={handleSaveName}
            >
              {savingName ? 'שומר...' : 'שמור'}
            </button>
            <button
              className="pSheetBtn pSheetBtnSecondary"
              onClick={() => setShowEditName(false)}
            >
              ביטול
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile
