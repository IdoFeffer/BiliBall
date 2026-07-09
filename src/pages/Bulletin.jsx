import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { announcements } from '../api'
import '../styles/Bulletin.scss'
import BottomNav from '../components/BottomNav'

const EMOJI_OPTIONS = ['🔥', '😂', '🎱', '💀', '👏']

const ballColors = [
  '#2660A4', '#f1c40f', '#e74c3c', '#27ae60',
  '#F19953', '#9b59b6', '#2980b9', '#111',
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

// Supports both new format {reactions: { emoji: [{id,username,full_name,avatar_url}] }}
// and old format {like_count, liked_by_me}
function normalizePost(post, user) {
  if (post.reactions) {
    return { ...post, replies: post.replies || [] }
  }
  const count = Number(post.like_count) || 0
  let fireUsers = []
  if (count > 0) {
    if (post.liked_by_me) {
      fireUsers.push({ id: String(user.id), username: user.username, full_name: user.full_name, avatar_url: null })
    }
    while (fireUsers.length < count) {
      fireUsers.push({ id: `__legacy_${fireUsers.length}`, username: 'משתמש', full_name: null, avatar_url: null })
    }
  }
  return {
    ...post,
    reactions: count > 0 ? { '🔥': fireUsers } : {},
    replies: post.replies || [],
  }
}

function normalizeReply(reply) {
  return {
    id: reply.id,
    author_id: reply.author_id || reply.authorId,
    username: reply.username,
    full_name: reply.full_name,
    avatar_url: reply.avatar_url || null,
    content: reply.content || reply.text,
    created_at: reply.created_at || reply.createdAt,
  }
}



function Bulletin({ toggleDark }) {
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')
  const [openPicker, setOpenPicker] = useState(null)
  const [replyDraft, setReplyDraft] = useState({})
  const [animatingReaction, setAnimatingReaction] = useState(null)
  const pickerRef = useRef(null)
  const textareaRef = useRef(null)

  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const leagueId = localStorage.getItem('leagueId')
  const leagueName = localStorage.getItem('leagueName')

  useEffect(() => {
    const load = async () => {
      try {
        const res = await announcements.get(leagueId)
        setPosts(res.data.map(p => normalizePost(p, user)))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  useEffect(() => {
    if (openPicker === null) return
    const handleOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setOpenPicker(null)
      }
    }
    const handleEsc = (e) => { if (e.key === 'Escape') setOpenPicker(null) }
    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('keydown', handleEsc)
    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [openPicker])

  const handleSend = async () => {
    if (!text.trim() || sending) return
    setSending(true)
    try {
      await announcements.post(leagueId, text)
      const res = await announcements.get(leagueId)
      setPosts(res.data.map(p => normalizePost(p, user)))
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
      setPosts(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      alert('שגיאה במחיקה')
    }
  }

  const handleEdit = async (id) => {
    if (!editText.trim()) return
    try {
      await announcements.put(id, editText)
      setPosts(prev => prev.map(p => p.id === id ? { ...p, content: editText } : p))
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

  const handleReact = async (postId, emoji) => {
    const userId = String(user.id)
    setOpenPicker(null)

    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p
      const reactions = { ...p.reactions }
      const users = [...(reactions[emoji] || [])]
      const idx = users.findIndex(u => String(u.id) === userId)
      if (idx >= 0) {
        users.splice(idx, 1)
      } else {
        users.push({ id: userId, username: user.username, full_name: user.full_name, avatar_url: user.avatar_url || null })
        setAnimatingReaction({ postId, emoji })
        setTimeout(() => setAnimatingReaction(null), 400)
      }
      const updated = { ...reactions }
      if (users.length === 0) {
        delete updated[emoji]
      } else {
        updated[emoji] = users
      }
      return { ...p, reactions: updated }
    }))

    try {
      await announcements.react(postId, emoji)
    } catch (err) {
      const res = await announcements.get(leagueId)
      setPosts(res.data.map(p => normalizePost(p, user)))
    }
  }

const handleAddReply = async (postId) => {
  const replyText = (replyDraft[postId] || '').trim()
  if (!replyText) return

  const tempId = `temp_${Date.now()}`
  const newReply = {
    id: tempId,
    author_id: user.id,
    username: user.username,
    full_name: user.full_name,
    avatar_url: user.avatar_url || null,
    content: replyText,
    created_at: new Date().toISOString(),
  }

  setPosts(prev => prev.map(p =>
    p.id === postId ? { ...p, replies: [...p.replies, newReply] } : p
  ))
  setReplyDraft(d => ({ ...d, [postId]: '' }))

  try {
    await announcements.addReply(postId, replyText)
    // משוך את התגובות המעודכנות מהserver
    const repliesRes = await announcements.getReplies(postId)
    setPosts(prev => prev.map(p =>
      p.id === postId ? { ...p, replies: repliesRes.data.map(normalizeReply) } : p
    ))
  } catch (err) {
    setPosts(prev => prev.map(p =>
      p.id === postId ? { ...p, replies: p.replies.filter(r => r.id !== tempId) } : p
    ))
    setReplyDraft(d => ({ ...d, [postId]: replyText }))
  }
}

  return (
    <div className="bulletin-page">
      <nav className="bulletin-nav">
        <div className="bulletin-nav-spacer" />
        <div className="bulletin-nav-center">
          <h1 className="navLogo">BiliBall 🎱</h1>
          {leagueName && <div className="leagueChip"><span>{leagueName}</span></div>}
        </div>
        {toggleDark
          ? <button className="bulletin-dark-toggle" onClick={toggleDark}>🌙</button>
          : <div className="bulletin-nav-spacer" />}
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
            <p className="bulletin-empty-sub">היה הראשון לכתוב משהו</p>
          </div>
        )}

        {posts.map((post, i) => {
          const isMe = post.username === user.username
          const initial = post.full_name?.[0] || post.username?.[0]
          const color = ballColors[i % ballColors.length]
          const visibleEmojis = EMOJI_OPTIONS.filter(e => (post.reactions[e]?.length || 0) > 0)

          return (
            <div key={post.id} className="bulletin-card">
              <div className="bulletin-card-header">
                {post.avatar_url ? (
                  <img src={post.avatar_url} alt="" className="bulletin-avatar-img" />
                ) : (
                  <div className="bulletin-avatar" style={{ background: color }}>
                    <div className="bulletin-avatar-inner">{initial}</div>
                  </div>
                )}
                <div className="bulletin-meta">
                  <span className="bulletin-name">
                    {post.full_name || post.username}
                    {isMe && <span className="youBadge">את/ה</span>}
                  </span>
                  <span className="bulletin-time">{timeAgo(post.created_at)}</span>
                </div>
                {isMe && (
                  <div className="bulletin-actions">
                    <button
                      className="bulletin-edit-btn"
                      onClick={() => { setEditingId(post.id); setEditText(post.content) }}
                      aria-label="ערוך הודעה"
                    >✎</button>
                    <button
                      className="bulletin-delete-btn"
                      onClick={() => handleDelete(post.id)}
                      aria-label="מחק הודעה"
                    >✕</button>
                  </div>
                )}
              </div>

              <p className="bulletin-content">{post.content}</p>

              {/* Reactions */}
              <div className="bulletin-footer">
                <div className="reaction-area">
                  {visibleEmojis.map(emoji => {
                    const users = post.reactions[emoji] || []
                    const mine = users.some(u => String(u.id) === String(user.id))
                    const isAnimating = animatingReaction?.postId === post.id && animatingReaction?.emoji === emoji
                    return (
                      <button
                        key={emoji}
                        className={`reaction-pill${mine ? ' mine' : ''}`}
                        onClick={() => handleReact(post.id, emoji)}
                        aria-label={`React ${emoji}, ${users.length}`}
                      >
                        <span className={`pill-emoji${isAnimating ? ' pop' : ''}`}>{emoji}</span>
                        <span className="pill-count">{users.length}</span>
                      </button>
                    )
                  })}

                  <div
                    className="picker-wrap"
                    ref={openPicker === post.id ? pickerRef : null}
                  >
                    <button
                      className="reaction-add"
                      onClick={() => setOpenPicker(openPicker === post.id ? null : post.id)}
                      aria-label="הוסף תגובה"
                    >＋</button>
                    {openPicker === post.id && (
                      <div className="emoji-picker">
                        {EMOJI_OPTIONS.map(emoji => (
                          <button
                            key={emoji}
                            className="picker-option"
                            onClick={() => handleReact(post.id, emoji)}
                            aria-label={`React ${emoji}`}
                          >{emoji}</button>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              </div>

              {/* Replies */}
              <div className="replies-section">
                {post.replies.length === 0 && (
                  <p className="reply-prompt">היה הראשון להגיב...</p>
                )}
                {post.replies.map((reply, ri) => (
                  <div key={reply.id} className="reply-row">
                    {reply.avatar_url ? (
                      <img src={reply.avatar_url} alt="" className="reply-avatar-img" />
                    ) : (
                      <div
                        className="reply-avatar"
                        style={{ background: ballColors[ri % ballColors.length] }}
                      >
                        {reply.full_name?.[0] || reply.username?.[0] || '?'}
                      </div>
                    )}
                    <div className="reply-body">
                      <span className="reply-name">{reply.full_name || reply.username}</span>
                      <span className="reply-text">{reply.content}</span>
                    </div>
                    <span className="reply-time">{timeAgo(reply.created_at)}</span>
                  </div>
                ))}

                <div className="reply-compose">
                  <input
                    type="text"
                    className="reply-input"
                    placeholder="הגב..."
                    value={replyDraft[post.id] || ''}
                    onChange={e => setReplyDraft(d => ({ ...d, [post.id]: e.target.value }))}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddReply(post.id) } }}
                    dir="rtl"
                  />
                  {(replyDraft[post.id] || '').trim() && (
                    <button className="reply-send" onClick={() => handleAddReply(post.id)}>↑</button>
                  )}
                </div>
              </div>

              {editingId === post.id && (
                <div className="bulletin-edit-compose">
                  <span className="bulletin-edit-label">עורך:</span>
                  <textarea
                    className="bulletin-input bulletin-edit-input"
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                    rows={1}
                    autoFocus
                  />
                  <button className="bulletin-save" onClick={() => handleEdit(post.id)}>✓</button>
                  <button className="bulletin-cancel" onClick={() => setEditingId(null)}>✕</button>
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
          onChange={e => setText(e.target.value)}
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

      <BottomNav active="bulletin" />
    </div>
  )
}

export default Bulletin
