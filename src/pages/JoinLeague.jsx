import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function JoinLeague() {
  const navigate = useNavigate()
  const [link, setLink] = useState('')

  const mockMembers = [
    { id: 1, name: 'יוסי', role: 'מנהל' },
    { id: 2, name: 'דני', role: 'מחובר' },
    { id: 3, name: '?', role: 'ממתין' },
  ]

  const handleJoin = () => {
    if (link.trim() === '') return
    navigate('/home')
  }

  return (
    <div>
      <h1>BiliBall 🎱</h1>
      <h2>הצטרף לליגה</h2>

      <input
        type="text"
        placeholder="הדבק קישור הזמנה..."
        value={link}
        onChange={(e) => setLink(e.target.value)}
      />

      <button onClick={handleJoin}>הצטרף</button>

      <h3>ליגת המרתף — חברים</h3>
      {mockMembers.map(member => (
        <div key={member.id}>
          <span>{member.name}</span>
          <span>{member.role}</span>
        </div>
      ))}
    </div>
  )
}

export default JoinLeague