import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import '../styles/Profile.scss'
import { players, games } from '../api'
import ProfileSkeleton from '../components/ProfileSkeleton'

function Profile() {
  const navigate = useNavigate()
  const { userId } = useParams()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [openNote, setOpenNote] = useState(null)

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
  const leagueId = localStorage.getItem('leagueId')
  const targetUserId = userId || currentUser.id
  const isOwnProfile = !userId || parseInt(userId) === currentUser.id

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await players.getStats(targetUserId, leagueId)
        setStats(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [targetUserId])

  if (loading) return <ProfileSkeleton />
  if (!stats) return <div style={{ padding: 20 }}>שגיאה בטעינה</div>

  const winRate =
    stats.wins + stats.losses > 0
      ? Math.round((stats.wins / (stats.wins + stats.losses)) * 100)
      : 0
  const score = stats.wins - stats.losses

  return (
    <div className="page">
      <header className="header">
        <h2 className="headerTitle">
          {isOwnProfile ? 'פרופיל' : stats.user.full_name}
        </h2>
        <div style={{ width: 60 }} />
      </header>

      <div className="section">
        <div className="playerInfo">
          <div className="avatarLg">{stats.user.full_name?.[0]}</div>
          <div>
            <p className="playerName">{stats.user.full_name}</p>
            <p className="memberSince">@{stats.user.username}</p>
          </div>
        </div>
      </div>

      <div className="section">
        <p className="sectionTitle">סטטיסטיקות</p>
        <div className="metricsGrid">
          <div className="metricCard">
            <div className="metricVal pos">{stats.wins}</div>
            <div className="metricLabel">נצחונות</div>
          </div>
          <div className="metricCard">
            <div className="metricVal neg">{stats.losses}</div>
            <div className="metricLabel">הפסדים</div>
          </div>
          <div className="metricCard">
            <div className="metricVal">{winRate}%</div>
            <div className="metricLabel">אחוז נצחון</div>
          </div>
          <div className="metricCard">
            <div className="metricVal">{stats.wins + stats.losses}</div>
            <div className="metricLabel">סה"כ משחקים</div>
          </div>
          <div className="metricCard">
            <div className={`metricVal ${score >= 0 ? 'pos' : 'neg'}`}>
              {score > 0 ? '+' : ''}
              {score}
            </div>
            <div className="metricLabel">מדד</div>
          </div>
        </div>
      </div>

      {stats.rivals.length > 0 && (
        <div className="section">
          <p className="sectionTitle">נגד כל שחקן</p>
          {stats.rivals.map((rival) => (
            <div key={rival.opponent_id} className="rivalRow">
              <div className="avatarSm">{rival.opponent_name?.[0]}</div>
              <span className="rivalName">{rival.opponent_name}</span>
              <div className="rivalBar">
                <div
                  className="rivalBarFill"
                  style={{
                    width: `${Math.round((rival.wins / rival.total) * 100)}%`,
                  }}
                />
              </div>
              <span className="rivalScore">
                {rival.wins}/{rival.total}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="section">
        <p className="sectionTitle">היסטוריית משחקים</p>
        {stats.games.length === 0 && (
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
        {stats.games.map((game) => (
          <div key={game.id}>
            <div className="historyRow">
              <span className={`resultBadge ${game.result}`}>
                {game.result === 'win' ? 'נצחון' : 'הפסד'}
              </span>
              <span className="historyOpponent">נגד {game.opponent_name}</span>
              {(game.winner_score > 0 || game.loser_score > 0) && (
                <span className="recentScore" style={{ marginRight: 6 }}>
                  {game.result === 'win'
                    ? `${game.winner_score} : ${game.loser_score}`
                    : `${game.loser_score} : ${game.winner_score}`}
                </span>
              )}{' '}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginRight: 'auto',
                }}
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
                <span className="historyDate">
                  {new Date(game.played_at).toLocaleDateString('he-IL')}
                </span>
                {isOwnProfile && (
                  <span
                    style={{
                      cursor: 'pointer',
                      fontSize: '14px',
                      color: '#ccc',
                    }}
                    onClick={async () => {
                      if (!window.confirm('למחוק את המשחק?')) return
                      try {
                        await games.delete(game.id)
                        setStats((prev) => ({
                          ...prev,
                          games: prev.games.filter((g) => g.id !== game.id),
                        }))
                      } catch (err) {
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
              <div
                className="noteTooltip"
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span>{game.note}</span>
                {isOwnProfile && (
                  <span
                    style={{
                      cursor: 'pointer',
                      color: '#aaa',
                      fontSize: '12px',
                    }}
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
                      } catch (err) {
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
        ))}
      </div>
    </div>
  )
}

export default Profile
