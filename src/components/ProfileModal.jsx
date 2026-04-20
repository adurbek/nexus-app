import { useState, useRef } from 'react'
import Modal from './Modal'

// Flag emojis for Uzbekistan and others
const FLAGS = ['🇺🇿','🇷🇺','🇺🇸','🇬🇧','🇩🇪','🇫🇷','🇰🇷','🇯🇵','🇹🇷','🇸🇦']
const STICKERS = ['⭐','💫','✨','🔥','💎','👑','🎯','🚀','⚡','🌟','🏆','💪','🎵','🎨','💻','🌍']

const GRADIENTS = [
  { label:'Tong', bg:'linear-gradient(135deg,#667eea,#764ba2)', text:'white' },
  { label:'Okean', bg:'linear-gradient(135deg,#0ea5e9,#6366f1)', text:'white' },
  { label:'Quyosh', bg:'linear-gradient(135deg,#f59e0b,#ef4444)', text:'white' },
  { label:'O\'rmon', bg:'linear-gradient(135deg,#10b981,#059669)', text:'white' },
  { label:'Shaftoli', bg:'linear-gradient(135deg,#f472b6,#fb923c)', text:'white' },
  { label:'Kecha', bg:'linear-gradient(135deg,#1e293b,#334155)', text:'white' },
  { label:'Kumush', bg:'linear-gradient(135deg,#e2e8f0,#cbd5e1)', text:'#1e293b' },
  { label:'Oltin', bg:'linear-gradient(135deg,#fbbf24,#f59e0b)', text:'#1e293b' },
]

export default function ProfileModal({ open, onClose, user, updateProfile, logout, showLogout }) {
  const [name,     setName]     = useState(user?.name    || '')
  const [sticker,  setSticker]  = useState(user?.sticker || '⭐')
  const [flag,     setFlag]     = useState(user?.flag    || '🇺🇿')
  const [avatar,   setAvatar]   = useState(user?.avatar  || null)
  const [gradient, setGradient] = useState(user?.gradient || GRADIENTS[0])
  const [saved,    setSaved]    = useState(false)
  const [tab,      setTab]      = useState('info') // 'info' | 'style'
  const fileRef = useRef()

  if (!user) return null

  const pickAvatar = e => {
    const file = e.target.files?.[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setAvatar(ev.target.result)
    reader.readAsDataURL(file)
  }

  const save = () => {
    if (!name.trim()) return
    const initials = name.trim().split(' ').map(x=>x[0]).join('').slice(0,2).toUpperCase()
    updateProfile({ name:name.trim(), sticker, flag, avatar, initials, gradient })
    setSaved(true)
    setTimeout(() => { setSaved(false); onClose() }, 700)
  }

  const handleLogout = () => { onClose(); setTimeout(logout, 200) }

  return (
    <Modal open={open} onClose={onClose} title="">
      {/* Profile card preview */}
      <div style={{
        background: gradient.bg, borderRadius:16, padding:'20px 16px',
        marginBottom:20, textAlign:'center', position:'relative', overflow:'hidden',
      }}>
        <div style={{position:'absolute',inset:0,backgroundImage:'radial-gradient(circle at 80% 20%,rgba(255,255,255,0.15) 0%,transparent 60%)',pointerEvents:'none'}}/>
        <div onClick={() => fileRef.current?.click()} style={{
          width:72,height:72,borderRadius:'50%',
          background:'rgba(255,255,255,0.2)',margin:'0 auto 10px',
          display:'flex',alignItems:'center',justifyContent:'center',
          fontSize:26,fontWeight:700,cursor:'pointer',
          border:'3px solid rgba(255,255,255,0.4)',overflow:'hidden',
          color: gradient.text,
        }}>
          {avatar ? <img src={avatar} alt="av" style={{width:'100%',height:'100%',objectFit:'cover'}}/> : (user.initials||'?')}
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={pickAvatar}/>
        <div style={{color:gradient.text,fontFamily:'var(--font-display)',fontWeight:700,fontSize:17,letterSpacing:'-0.3px'}}>
          {name||user.name} {flag} {sticker}
        </div>
        <div style={{color:gradient.text,opacity:0.7,fontSize:12,marginTop:3}}>{user.email}</div>
        <div style={{fontSize:10,color:gradient.text,opacity:0.5,marginTop:6}}>Rasmni bosib o'zgartiring</div>
      </div>

      {/* Tabs */}
      <div style={{display:'flex',background:'rgba(0,0,0,0.05)',borderRadius:10,padding:3,marginBottom:16,gap:3}}>
        {[['info','👤 Ma\'lumot'],['style','🎨 Uslub']].map(([id,label]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            flex:1,padding:'8px',border:'none',borderRadius:8,fontSize:13,fontWeight:600,
            cursor:'pointer',fontFamily:'var(--font)',transition:'var(--tr)',
            background: tab===id ? 'white' : 'transparent',
            color: tab===id ? 'var(--text-primary)' : 'var(--text-muted)',
            boxShadow: tab===id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
          }}>{label}</button>
        ))}
      </div>

      {tab === 'info' && (
        <>
          <div className="field">
            <label className="field-label">Ism Familiya</label>
            <input className="input" value={name} onChange={e=>setName(e.target.value)} placeholder="Ism Familiya"/>
          </div>
          <div className="field">
            <label className="field-label">Bayroq tanlang</label>
            <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
              {FLAGS.map(f => (
                <button key={f} onClick={()=>setFlag(f)} style={{
                  width:38,height:38,fontSize:20,cursor:'pointer',
                  border:`2px solid ${flag===f?'#3b82f6':'rgba(0,0,0,0.1)'}`,
                  borderRadius:9,background:flag===f?'rgba(59,130,246,0.08)':'transparent',
                  transition:'var(--tr)',
                }}>{f}</button>
              ))}
            </div>
          </div>
          <div className="field">
            <label className="field-label">Stiker tanlang</label>
            <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
              {STICKERS.map(s => (
                <button key={s} onClick={()=>setSticker(s)} style={{
                  width:36,height:36,fontSize:18,cursor:'pointer',
                  border:`2px solid ${sticker===s?'#3b82f6':'rgba(0,0,0,0.1)'}`,
                  borderRadius:9,background:sticker===s?'rgba(59,130,246,0.08)':'transparent',
                  transition:'var(--tr)',
                }}>{s}</button>
              ))}
            </div>
          </div>
          <div className="field">
            <label className="field-label">Email</label>
            <input className="input" value={user.email} readOnly style={{opacity:.5,cursor:'not-allowed'}}/>
          </div>
        </>
      )}

      {tab === 'style' && (
        <div className="field">
          <label className="field-label">Profil rangi (Telegram Premium uslubida)</label>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8}}>
            {GRADIENTS.map((g,i) => (
              <button key={i} onClick={()=>setGradient(g)} style={{
                height:52,borderRadius:12,cursor:'pointer',
                background:g.bg,
                border:`3px solid ${gradient.label===g.label?'#3b82f6':'transparent'}`,
                transition:'var(--tr)',
                boxShadow: gradient.label===g.label ? '0 0 0 4px rgba(59,130,246,0.2)' : 'none',
              }}>
                <div style={{fontSize:10,color:g.text,fontWeight:600,opacity:0.8}}>{g.label}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="modal-row">
        <button className="btn btn-glass" onClick={onClose} style={{flex:1}}>Bekor</button>
        <button onClick={save} style={{
          flex:1,padding:'11px',background:'linear-gradient(135deg,#3b82f6,#6366f1)',color:'white',
          border:'none',borderRadius:'var(--r-sm)',fontSize:14,fontWeight:600,
          cursor:'pointer',fontFamily:'var(--font-display)',transition:'var(--tr)',
          boxShadow:'0 4px 14px rgba(99,102,241,0.35)',
        }}>
          {saved ? '✓ Saqlandi' : 'Saqlash'}
        </button>
      </div>

      {showLogout && (
        <button onClick={handleLogout} style={{
          width:'100%',marginTop:10,padding:'11px',
          background:'rgba(220,38,38,0.06)',border:'1.5px solid #fecaca',
          borderRadius:'var(--r-sm)',color:'#dc2626',fontSize:13,fontWeight:600,
          cursor:'pointer',fontFamily:'var(--font)',transition:'var(--tr)',
          display:'flex',alignItems:'center',justifyContent:'center',gap:8,
        }}>
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Akkauntdan chiqish
        </button>
      )}
    </Modal>
  )
}
