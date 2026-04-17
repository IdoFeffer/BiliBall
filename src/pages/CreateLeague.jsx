import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/CreateLeague.scss'

function CreateLeague() {
  const navigate = useNavigate()
  const [leagueName, setLeagueName] = useState('')
  const [created, setCreated] = useState(false)
  const inviteLink = 'biliball.app/join/abc123'

  const handleCreate = () => {
    if (leagueName.trim() === '') return
    setCreated(true)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink)
    alert('הקישור הועתק!')
  }

  return (
    <div className="page">
      <header className="header">
        <button className="backBtn" onClick={() => navigate('/login')}>← חזרה</button>
        <h2 className="headerTitle">צור ליגה</h2>
        <div style={{ width: 60 }} />
      </header>

      <div className="section">
        <p className="label">שם הליגה</p>
        <input
          className="input"
          type="text"
          placeholder="ליגת המרתף 🎱"
          value={leagueName}
          onChange={(e) => setLeagueName(e.target.value)}
          disabled={created}
        />
        {!created && (
          <button className="submitBtn" onClick={handleCreate}>
            צור ליגה
          </button>
        )}
        {created && (
          <div className="successBanner">
            ✓ הליגה נוצרה! עכשיו הזמן חברים
          </div>
        )}
      </div>

      {created && (
        <>
          <div className="section">
            <p className="sectionTitle">הזמן חברים</p>
            <div className="linkBox">
              <span className="linkText">{inviteLink}</span>
              <button className="copyBtn" onClick={handleCopy}>העתק</button>
            </div>
            <div className="shareButtons">
              <button className="shareBtn">📱 וואטסאפ</button>
              <button className="shareBtn">✉️ SMS</button>
            </div>
          </div>

          <div className="section">
            <p className="sectionTitle">{leagueName} — חברים</p>
            <div className="memberRow">
              <div className="avatar">י</div>
              <span className="memberName">יוסי</span>
              <span className="badge admin">מנהל</span>
            </div>
            <div className="memberRow">
              <div className="avatar dim">?</div>
              <span className="memberName muted">ממתין להצטרפות</span>
              <span className="badge pending">ממתין</span>
            </div>
            <div className="memberRow">
              <div className="avatar dim">?</div>
              <span className="memberName muted">ממתין להצטרפות</span>
              <span className="badge pending">ממתין</span>
            </div>
          </div>

          <button className="enterBtn" onClick={() => navigate('/home')}>
            כנס לליגה
          </button>
        </>
      )}
    </div>
  )
}

export default CreateLeague