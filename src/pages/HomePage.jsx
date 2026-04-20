export default function HomePage({ user, tracks, photos, notes, setView }) {
  const now    = new Date()
  const days   = ['Yakshanba','Dushanba','Seshanba','Chorshanba','Payshanba','Juma','Shanba']
  const months = ['Yanvar','Fevral','Mart','Aprel','May','Iyun','Iyul','Avgust','Sentyabr','Oktyabr','Noyabr','Dekabr']
  const dateStr = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`

  const curTrack  = Array.isArray(tracks) ? tracks[0] : null
  const notesList = Array.isArray(notes) ? notes : []
  const lastNote  = notesList.length ? notesList[notesList.length-1] : null
  const noteText  = lastNote ? (lastNote.text || lastNote.preview || 'Yozuv bor').slice(0,90) : 'Hech narsa yozilmagan...'
  const lastPhoto = Array.isArray(photos) && photos.length ? photos[photos.length-1].data : null

  return (
    <div className="view-wrap">
      {/* Topbar */}
      <div className="topbar">
        <div>
          <div className="page-title">Salom, {user?.emoji||'👋'} {user?.name?.split(' ')[0]||'Foydalanuvchi'}</div>
          <div className="page-sub">{dateStr}</div>
        </div>
        <div className="status-pill"><div className="status-dot"/>Faol</div>
      </div>

      {/* Hero */}
      <div className="hero-card">
        <div className="hero-orb"/>
        <div className="hero-grid"/>
        <div className="hero-live"><div className="status-dot" style={{width:6,height:6}}/>Jonli ko'rinish</div>
        <div className="hero-title">Nexus Dashboard</div>
        <div className="hero-desc">Barcha bo'limlaringiz bir joyda</div>
        <div className="hero-stats">
          <div className="hero-stat">{Array.isArray(tracks)?tracks.length:0} ta kuy</div>
          <div className="hero-stat">{Array.isArray(photos)?photos.length:0} ta rasm</div>
          <div className="hero-stat">{notesList.length} ta yozuv</div>
          <div className="hero-stat">AI tayyor</div>
        </div>
      </div>

      {/* Quick cards */}
      <div className="grid-2">
        <div className="mini-card" onClick={()=>setView('music')}>
          <div className="mini-card-ico">{curTrack?.emoji||'🎵'}</div>
          <div className="mini-card-title">{curTrack?.title||"Kuy yo'q"}</div>
          <div className="mini-card-sub">{curTrack?.artist||'Musiqa bo\'limi'}</div>
        </div>
        <div className="mini-card" onClick={()=>setView('save')}>
          {lastPhoto
            ? <img src={lastPhoto} alt="last" style={{width:'100%',height:60,objectFit:'cover',borderRadius:9,marginBottom:8,display:'block'}}/>
            : <div className="mini-card-ico">📷</div>
          }
          <div className="mini-card-title">Fotoalbom</div>
          <div className="mini-card-sub">{Array.isArray(photos)?photos.length:0} ta rasm</div>
        </div>
      </div>

      {/* Notes preview */}
      <div className="card" style={{cursor:'pointer'}} onClick={()=>setView('lamp')}>
        <span className="label">Oxirgi yozuv</span>
        <div style={{fontSize:14,color:'var(--text-secondary)',lineHeight:1.7}}>{noteText}</div>
      </div>

      {/* Quick nav */}
      <div className="grid-3">
        {[
          {v:'music', ico:'🎵', t:'Musiqa'},
          {v:'ai',    ico:'🤖', t:'AI Chat'},
          {v:'save',  ico:'🖼️', t:'Albom'},
        ].map(({v,ico,t})=>(
          <div key={v} className="mini-card" onClick={()=>setView(v)} style={{textAlign:'center'}}>
            <div style={{fontSize:26,marginBottom:8}}>{ico}</div>
            <div className="mini-card-title">{t}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
