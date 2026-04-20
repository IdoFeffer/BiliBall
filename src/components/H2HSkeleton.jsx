function H2HSkeleton() {
  const sk = { background: '#e0e0e0', borderRadius: 4 }

  return (
    <div style={{ background: '#e8f5ee', minHeight: '100vh' }}>
      <div style={{ background: '#2660A4', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#EDF7F6' }}>ראש בראש</div>
      </div>

      <div style={{ margin: 8, background: 'rgba(255,255,255,0.75)', borderRadius: 8, padding: 16, border: '0.5px solid rgba(196,115,53,0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1, height: 36, ...sk, borderRadius: 8 }} />
          <div style={{ width: 30, height: 20, ...sk }} />
          <div style={{ flex: 1, height: 36, ...sk, borderRadius: 8 }} />
        </div>
      </div>

      <div style={{ margin: 8, background: 'rgba(255,255,255,0.75)', borderRadius: 8, padding: 20, border: '0.5px solid rgba(196,115,53,0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', ...sk, margin: '0 auto 8px' }} />
            <div style={{ width: 70, height: 10, ...sk, marginBottom: 6 }} />
            <div style={{ width: 40, height: 24, ...sk, margin: '0 auto' }} />
          </div>
          <div style={{ width: 40, height: 20, ...sk }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', ...sk, margin: '0 auto 8px' }} />
            <div style={{ width: 70, height: 10, ...sk, marginBottom: 6 }} />
            <div style={{ width: 40, height: 24, ...sk, margin: '0 auto' }} />
          </div>
        </div>
        <div style={{ height: 6, ...sk, borderRadius: 4, marginBottom: 16 }} />
        <div style={{ width: '50%', height: 30, ...sk, borderRadius: 20, margin: '0 auto' }} />
      </div>

      <div style={{ margin: 8, background: 'rgba(255,255,255,0.75)', borderRadius: 8, padding: 16, border: '0.5px solid rgba(196,115,53,0.15)' }}>
        <div style={{ width: '40%', height: 10, ...sk, marginBottom: 12 }} />
        {[1,2,3].map(i => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '0.5px solid rgba(196,115,53,0.1)' }}>
            <div style={{ width: 80, height: 22, borderRadius: 20, ...sk }} />
            <div style={{ flex: 1, height: 10, ...sk }} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default H2HSkeleton