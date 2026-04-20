function ProfileSkeleton() {
  const sk = { background: '#e0e0e0', borderRadius: 4 }

  return (
    <div style={{ background: '#e8f5ee', minHeight: '100vh' }}>
      <div style={{ background: '#2660A4', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#EDF7F6' }}>פרופיל</div>
      </div>

      <div style={{ margin: 8, background: 'rgba(255,255,255,0.75)', borderRadius: 8, padding: 16, border: '0.5px solid rgba(196,115,53,0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', ...sk }} />
          <div>
            <div style={{ width: 120, height: 14, ...sk, marginBottom: 8 }} />
            <div style={{ width: 80, height: 10, ...sk }} />
          </div>
        </div>
      </div>

      <div style={{ margin: 8, background: 'rgba(255,255,255,0.75)', borderRadius: 8, padding: 16, border: '0.5px solid rgba(196,115,53,0.15)' }}>
        <div style={{ width: '40%', height: 10, ...sk, marginBottom: 12 }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {[1,2,3,4,5].map(i => (
            <div key={i} style={{ background: '#f5f5f5', borderRadius: 8, padding: 12, textAlign: 'center' }}>
              <div style={{ width: '60%', height: 20, ...sk, margin: '0 auto 6px' }} />
              <div style={{ width: '80%', height: 8, ...sk, margin: '0 auto' }} />
            </div>
          ))}
        </div>
      </div>

      <div style={{ margin: 8, background: 'rgba(255,255,255,0.75)', borderRadius: 8, padding: 16, border: '0.5px solid rgba(196,115,53,0.15)' }}>
        <div style={{ width: '40%', height: 10, ...sk, marginBottom: 12 }} />
        {[1,2,3].map(i => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '0.5px solid rgba(196,115,53,0.1)' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', ...sk }} />
            <div style={{ flex: 1, height: 10, ...sk }} />
            <div style={{ width: 60, height: 6, ...sk }} />
            <div style={{ width: 30, height: 10, ...sk }} />
          </div>
        ))}
      </div>

      <div style={{ margin: 8, background: 'rgba(255,255,255,0.75)', borderRadius: 8, padding: 16, border: '0.5px solid rgba(196,115,53,0.15)' }}>
        <div style={{ width: '40%', height: 10, ...sk, marginBottom: 12 }} />
        {[1,2,3,4].map(i => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '0.5px solid rgba(196,115,53,0.1)' }}>
            <div style={{ width: 44, height: 22, borderRadius: 20, ...sk }} />
            <div style={{ flex: 1, height: 10, ...sk }} />
            <div style={{ width: 50, height: 10, ...sk }} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProfileSkeleton