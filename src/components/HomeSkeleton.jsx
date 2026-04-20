function HomeSkeleton() {
  return (
    <div style={{ background: '#e8f5ee', minHeight: '100vh' }}>
      <div style={{
        background: '#2660A4',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#EDF7F6' }}>BiliBall 🎱</div>
        </div>
        <div style={{ width: 32 }} />
      </div>

      <div style={{ margin: 8, background: 'rgba(255,255,255,0.75)', borderRadius: 8, padding: 16, border: '0.5px solid rgba(196,115,53,0.15)' }}>
        <div style={{ height: 10, background: '#e0e0e0', borderRadius: 4, width: '40%', marginBottom: 12 }} />
        <div style={{ background: '#2660A4', borderRadius: 8, padding: 12, display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />
          <div style={{ flex: 1, height: 14, background: 'rgba(255,255,255,0.2)', borderRadius: 4 }} />
          <div style={{ width: 60, height: 14, background: 'rgba(255,255,255,0.2)', borderRadius: 4 }} />
        </div>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 0', borderBottom: '0.5px solid rgba(196,115,53,0.1)' }}>
            <div style={{ width: 16, height: 10, background: '#e0e0e0', borderRadius: 4 }} />
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#e0e0e0' }} />
            <div style={{ flex: 1, height: 10, background: '#e0e0e0', borderRadius: 4 }} />
            <div style={{ width: 60, height: 10, background: '#e0e0e0', borderRadius: 4 }} />
          </div>
        ))}
      </div>

      <div style={{ margin: 8, background: 'rgba(255,255,255,0.75)', borderRadius: 8, padding: 16, border: '0.5px solid rgba(196,115,53,0.15)' }}>
        <div style={{ height: 10, background: '#e0e0e0', borderRadius: 4, width: '40%', marginBottom: 12 }} />
        {[1, 2, 3].map(i => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 0', borderBottom: '0.5px solid rgba(196,115,53,0.1)' }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#e0e0e0' }} />
            <div style={{ flex: 1, height: 10, background: '#e0e0e0', borderRadius: 4 }} />
            <div style={{ width: 30, height: 10, background: '#e0e0e0', borderRadius: 4 }} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default HomeSkeleton