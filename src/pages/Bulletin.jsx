import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { announcements } from '../api'
import '../styles/Bulletin.scss'

const ballColors = [
  '#2660A4',
  '#f1c40f',
  '#e74c3c',
  '#27ae60',
  '#F19953',
  '#9b59b6',
  '#2980b9',
  '#111',
]

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr + 'Z')
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'עכשיו'
  if (mins < 60) return `לפני ${mins} דק'`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `לפני ${hrs} שע'`
  const days = Math.floor(hrs / 24)
  return `לפני ${days} ימים`
}

function Bulletin() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')
  const textareaRef = useRef(null)

  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const leagueId = localStorage.getItem('leagueId')
  const leagueName = localStorage.getItem('leagueName')

  useEffect(() => {
    const load = async () => {
      try {
        const res = await announcements.get(leagueId)
        setPosts(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleSend = async () => {
    if (!text.trim() || sending) return
    setSending(true)
    try {
      await announcements.post(leagueId, text)
      const res = await announcements.get(leagueId)
      setPosts(res.data)
      setText('')
    } catch (err) {
      alert('שגיאה בשליחה')
    } finally {
      setSending(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await announcements.delete(id)
      setPosts((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      alert('שגיאה במחיקה')
    }
  }

  const handleEdit = async (id) => {
    if (!editText.trim()) return
    try {
      await announcements.put(id, editText)
      setPosts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, content: editText } : p)),
      )
      setEditingId(null)
      setEditText('')
    } catch (err) {
      alert('שגיאה בעריכה')
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleLike = async (id) => {
    try {
      const res = await announcements.like(id)
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id !== id) return p
          const liked = res.data.liked
          return {
            ...p,
            like_count: liked
              ? Number(p.like_count) + 1
              : Number(p.like_count) - 1,
            liked_by_me: liked ? 1 : 0,
          }
        }),
      )
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="bulletin-page">
      <nav className="bulletin-nav">
        <div style={{ width: 40 }} />
        <div style={{ textAlign: 'center' }}>
          <h1 className="navLogo">BiliBall 🎱</h1>
          <div className="leagueChip" style={{ cursor: 'default' }}>
            <span>{leagueName}</span>
          </div>
        </div>
        <div style={{ width: 40 }} />
      </nav>

      <div className="bulletin-header">
        <span className="bulletin-title">לוח מודעות</span>
        <span className="bulletin-sub">{posts.length} הודעות</span>
      </div>

      <div className="bulletin-feed">
        {loading && <div className="bulletin-loading">טוען...</div>}
        {!loading && posts.length === 0 && (
          <div className="bulletin-empty">
            <p className="bulletin-empty-icon">📢</p>
            <p>אין הודעות עדיין</p>
            <p style={{ fontSize: '13px', opacity: 0.6 }}>
              היה הראשון לכתוב משהו
            </p>
          </div>
        )}
        {posts.map((post, i) => {
          const isMe = post.username === user.username
          const initial = post.full_name?.[0] || post.username?.[0]
          const color = ballColors[i % ballColors.length]
          return (
            <div key={post.id} className="bulletin-card">
              <div className="bulletin-card-header">
                <div className="bulletin-avatar" style={{ background: color }}>
                  <div className="bulletin-avatar-inner">{initial}</div>
                </div>
                <div className="bulletin-meta">
                  <span className="bulletin-name">
                    {post.full_name || post.username}
                    {isMe && <span className="youBadge">את/ה</span>}
                  </span>
                  <span className="bulletin-time">
                    {timeAgo(post.created_at)}
                  </span>
                </div>
                {isMe && (
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      className="bulletin-edit"
                      onClick={() => {
                        setEditingId(post.id)
                        setEditText(post.content)
                      }}
                      aria-label="ערוך הודעה"
                    >
                      ✎
                    </button>
                    <button
                      className="bulletin-delete"
                      onClick={() => handleDelete(post.id)}
                      aria-label="מחק הודעה"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
              <p className="bulletin-content">{post.content}</p>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  borderTop: '0.5px solid #e8f5ee',
                  paddingTop: '8px',
                  marginTop: '8px',
                }}
              >
                <button
                  className="bulletin-like"
                  onClick={() => handleLike(post.id)}
                >
                  ❤️ {post.like_count || 0}
                </button>
              </div>
              {editingId === post.id && (
                <div className="bulletin-edit-compose">
                  <span className="bulletin-edit-label">עורך:</span>
                  <textarea
                    className="bulletin-input"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    rows={1}
                    style={{ flex: 1 }}
                    autoFocus
                  />
                  <button
                    className="bulletin-save"
                    onClick={() => handleEdit(post.id)}
                  >
                    ✓
                  </button>
                  <button
                    className="bulletin-cancel"
                    onClick={() => setEditingId(null)}
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="bulletin-compose">
        <textarea
          ref={textareaRef}
          className="bulletin-input"
          placeholder="כתוב הודעה לליגה..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKey}
          rows={2}
          maxLength={500}
        />
        <button
          className="bulletin-send"
          onClick={handleSend}
          disabled={!text.trim() || sending}
        >
          {sending ? '...' : '↑'}
        </button>
      </div>

      <nav className="bottomNav">
        <button className="navTab" onClick={() => navigate('/home')}>
          <span className="navTabIcon">🏠</span>
          בית
        </button>
        <button className="navCenter" onClick={() => navigate('/add-game')}>
          <span className="navCenterIcon">+</span>
          הוספת משחק
        </button>
        <button className="navTab active" onClick={() => navigate('/profile')}>
          <span className="navTabIcon">👤</span>
          פרופיל
        </button>
      </nav>
    </div>
  )
}

export default Bulletin
