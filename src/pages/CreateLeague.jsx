import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

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
    <div>
      <h1>BiliBall 🎱</h1>
      <h2>צור ליגה</h2>

      <input
        type="text"
        placeholder="שם הליגה"
        value={leagueName}
        onChange={(e) => setLeagueName(e.target.value)}
        disabled={created}
      />

      {!created && (
        <button onClick={handleCreate}>צור ליגה</button>
      )}

      {created && (
        <div>
          <p>הליגה נוצרה! הזמן חברים</p>

          <p>{inviteLink}</p>
          <button onClick={handleCopy}>העתק קישור</button>

          <button>📱 וואטסאפ</button>
          <button>✉️ SMS</button>

          <h3>חברי הליגה</h3>
          <div>
            <span>יוסי</span>
            <span>מנהל</span>
          </div>
          <div>
            <span>ממתין להצטרפות</span>
            <span>ממתין</span>
          </div>

          <button onClick={() => navigate('/home')}>כנס לליגה</button>
        </div>
      )}
    </div>
  )
}

export default CreateLeague