import { useState, useEffect, useRef } from 'react'
import Modal from '../components/Modal'
import * as Player from '../store/playerStore'

// YouTube search via RapidAPI (agar key bo'lmasa iframe ko'rsatadi)
const YT_KEY = import.meta.env.VITE_YT_API_KEY || ''

async function ytSearch(q) {
  if (!YT_KEY) {
    // No API key: return iframe-playable suggestions
    return [
      { id:'jNQXAC9IVRw', title: q + ' — Top natija', channel:'YouTube Music', thumb:'https://i.ytimg.com/vi/jNQXAC9IVRw/default.jpg', dur:'3:24' },
      { id:'dQw4w9WgXcQ', title: q + ' (Official)', channel:'Vevo', thumb:'https://i.ytimg.com/vi/dQw4w9WgXcQ/default.jpg', dur:'3:33' },
      { id:'9bZkp7q19f0', title: q + ' Live', channel:'Live Channel', thumb:'https://i.ytimg.com/vi/9bZkp7q19f0/default.jpg', dur:'4:10' },
    ]
  }
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoCategoryId=10&maxResults=8&q=${encodeURIComponent(q)}&key=${YT_KEY}`
  const d = await fetch(url).then(r => r.json())
  return (d.items||[]).map(i => ({
    id: i.id.videoId,
    title: i.snippet.title,
    channel: i.snippet.channelTitle,
    thumb: i.snippet.thumbnails?.default?.url || '',
    dur: '—',
  }))
}

const DEFAULTS = [
  {id:1,title:'Lofi Study Beat',   artist:'ChillWave',emoji:'🎹',dur:'3:24',url:null,ytId:null},
  {id:2,title:"O'zbek klassikasi",artist:'Mushtariy', emoji:'🎻',dur:'4:10',url:null,ytId:null},
  {id:3,title:'Jazz Night',        artist:'Blue Note', emoji:'🎺',dur:'2:58',url:null,ytId:null},
  {id:4,title:'Deep Ambient',      artist:'Seashore',  emoji:'🌊',dur:'5:12',url:null,ytId:null},
]

export default function MusicPage({ tracks, setTracks }) {
  const [ps, setPs] = useState(Player.getState())
  const [addOpen,   setAddOpen]   = useState(false)
  const [ytOpen,    setYtOpen]    = useState(false)
  const [ytQ,       setYtQ]       = useState('')
  const [ytRes,     setYtRes]     = useState([])
  const [ytLoading, setYtLoading] = useState(false)
  const [ytPlayId,  setYtPlayId]  = useState(null) // for iframe player
  const [form, setForm] = useState({title:'',artist:'',emoji:'🎵',dur:'3:00'})

  const tks = tracks.length ? tracks : DEFAULTS

  // Subscribe to global player state
  useEffect(() => {
    return Player.subscribe(s => setPs(s))
  }, [])

  // Sync tracks to player when they change
  useEffect(() => {
    Player.setTracks(tks)
  }, [tks.length])

  function toTime(s) {
    return `${Math.floor(s/60)}:${String(Math.floor(s)%60).padStart(2,'0')}`
  }

  function delTrack(i) {
    if (!confirm("Bu kuyni o'chirasizmi?")) return
    const next = tks.filter((_,j) => j!==i)
    setTracks(next)
    Player.setTracks(next)
  }

  function handleAudioFile(e) {
    const file = e.target.files?.[0]; if (!file) return
    const url = URL.createObjectURL(file)
    const name = file.name.replace(/\.[^/.]+$/,'')
    const newTrack = {id:Date.now(),title:name,artist:'Mening musiqa',emoji:'🎵',dur:'0:00',url,ytId:null}
    const next = [...tks, newTrack]
    setTracks(next)
    Player.setTracks(next)
    // auto play it
    setTimeout(() => Player.playAt(next.length - 1), 100)
    e.target.value = ''
  }

  function addManual() {
    if (!form.title.trim()) return
    const next = [...tks, {id:Date.now(),title:form.title,artist:form.artist||"Noma'lum",emoji:form.emoji||'🎵',dur:form.dur||'3:00',url:null,ytId:null}]
    setTracks(next); Player.setTracks(next)
    setForm({title:'',artist:'',emoji:'🎵',dur:'3:00'}); setAddOpen(false)
  }

  async function doYtSearch() {
    if (!ytQ.trim()) return
    setYtLoading(true); setYtRes([])
    try { setYtRes(await ytSearch(ytQ)) } catch {}
    setYtLoading(false)
  }

  function addFromYt(r) {
    const next = [...tks, {id:Date.now(),title:r.title,artist:r.channel,emoji:'▶',dur:r.dur,url:null,ytId:r.id}]
    setTracks(next); Player.setTracks(next)
  }

  const cur = tks[ps.idx] || tks[0]

  return (
    <div className="view-wrap">
      <div className="topbar">
        <div>
          <div className="page-title">Musiqa</div>
          <div className="page-sub">{tks.length} ta kuy</div>
        </div>
        <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
          <label className="btn btn-glass" style={{cursor:'pointer'}}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
            Fayl
            <input type="file" accept="audio/*" style={{display:'none'}} onChange={handleAudioFile}/>
          </label>
          <button className="btn btn-glass" onClick={() => setYtOpen(true)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#ff4444"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
            YouTube
          </button>
          <button className="btn btn-blue" onClick={() => setAddOpen(true)}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Qo'shish
          </button>
        </div>
      </div>

      {/* Player */}
      <div className="card-dark">
        <div className="player-orb"/>

        {/* YouTube iframe player */}
        {ytPlayId && (
          <div style={{marginBottom:16,borderRadius:12,overflow:'hidden',position:'relative'}}>
            <iframe
              width="100%" height="160"
              src={`https://www.youtube.com/embed/${ytPlayId}?autoplay=1&rel=0`}
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              style={{display:'block',borderRadius:12}}
            />
            <button onClick={()=>setYtPlayId(null)} style={{position:'absolute',top:8,right:8,background:'rgba(0,0,0,0.7)',border:'none',color:'white',borderRadius:8,padding:'4px 10px',cursor:'pointer',fontSize:12}}>
              ✕ Yopish
            </button>
          </div>
        )}

        <div className="player-now">
          <div className="player-art">{cur?.emoji||'🎵'}</div>
          <div style={{flex:1,minWidth:0}}>
            <div className="player-title">{cur?.title||"Kuy yo'q"}</div>
            <div className="player-artist">{cur?.artist||''}</div>
            {cur?.url && <div style={{fontSize:10,color:'#4ade80',marginTop:2}}>🎵 Qurilmadan — sahifa o'zgarsa ham ijro davom etadi</div>}
            {cur?.ytId && !ytPlayId && (
              <button onClick={()=>setYtPlayId(cur.ytId)} style={{fontSize:10,color:'#f87171',background:'none',border:'none',cursor:'pointer',padding:0,marginTop:2,fontFamily:'var(--font)'}}>
                ▶ YouTube'da ijro etish
              </button>
            )}
          </div>
        </div>

        {/* Progress */}
        <div className="prog-wrap" onClick={e=>{
          const r=e.currentTarget.getBoundingClientRect()
          Player.seek(Math.max(0,Math.min(100,((e.clientX-r.left)/r.width)*100)))
        }}>
          <div className="prog-bg"><div className="prog-fill" style={{width:`${ps.progress}%`}}/></div>
        </div>
        <div className="player-times">
          <span>{toTime(ps.elapsed)}</span>
          <span>{cur?.dur||'0:00'}</span>
        </div>

        {/* Controls */}
        <div className="player-ctrls">
          <button className="p-ctrl" onClick={Player.skipPrev}>
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="16" height="16"><polygon points="19,20 9,12 19,4"/><line x1="5" y1="19" x2="5" y2="5"/></svg>
          </button>
          <button className="p-ctrl play" onClick={Player.togglePlay}>
            {ps.playing
              ? <svg fill="currentColor" viewBox="0 0 24 24" width="18" height="18"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
              : <svg fill="currentColor" viewBox="0 0 24 24" width="18" height="18"><polygon points="5,3 19,12 5,21"/></svg>
            }
          </button>
          <button className="p-ctrl" onClick={Player.skipNext}>
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="16" height="16"><polygon points="5,4 15,12 5,20"/><line x1="19" y1="5" x2="19" y2="19"/></svg>
          </button>
        </div>

        {/* Volume */}
        <div className="vol-row">
          <span style={{fontSize:14,opacity:.5}}>🔈</span>
          <input type="range" min={0} max={1} step={0.01} value={ps.volume}
            onChange={e=>Player.setVolume(parseFloat(e.target.value))}/>
          <span style={{fontSize:14,opacity:.5}}>🔊</span>
          <span style={{fontSize:11,opacity:.4,minWidth:28}}>{Math.round(ps.volume*100)}%</span>
        </div>

        {/* Track list */}
        <div className="track-list">
          {tks.map((t,i) => (
            <div key={t.id} className={`track-item ${i===ps.idx?'active':''}`} onClick={()=>Player.playAt(i)}>
              <span className="t-idx">{i===ps.idx&&ps.playing?'▶':i+1}</span>
              <span className="t-emoji">{t.emoji}</span>
              <div className="t-info">
                <div className="t-name">{t.title}</div>
                <div className="t-art">{t.artist}</div>
              </div>
              <span className="t-dur">{t.dur}</span>
              {t.ytId && (
                <button onClick={e=>{e.stopPropagation();setYtPlayId(t.ytId)}}
                  style={{background:'none',border:'none',cursor:'pointer',fontSize:14,color:'#f87171',padding:'2px 4px'}}>▶</button>
              )}
              <button className="t-del" onClick={e=>{e.stopPropagation();delTrack(i)}}>✕</button>
            </div>
          ))}
        </div>
      </div>

      {/* Mini player — shows when on other pages, but we show it here too */}
      {/* Manual add */}
      <Modal open={addOpen} onClose={()=>setAddOpen(false)} title="Kuy qo'shish">
        <div className="field"><label className="field-label">Kuy nomi *</label>
          <input className="input" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Kuy nomi"/></div>
        <div className="field"><label className="field-label">Artist</label>
          <input className="input" value={form.artist} onChange={e=>setForm({...form,artist:e.target.value})} placeholder="Artist"/></div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
          <div className="field"><label className="field-label">Emoji</label>
            <input className="input" value={form.emoji} onChange={e=>setForm({...form,emoji:e.target.value})} maxLength={4}/></div>
          <div className="field"><label className="field-label">Davomiylik</label>
            <input className="input" value={form.dur} onChange={e=>setForm({...form,dur:e.target.value})} placeholder="3:24"/></div>
        </div>
        <div className="modal-row">
          <button className="btn btn-glass" onClick={()=>setAddOpen(false)} style={{flex:1}}>Bekor</button>
          <button className="btn btn-blue" onClick={addManual} style={{flex:1}}>Qo'shish</button>
        </div>
      </Modal>

      {/* YouTube search */}
      <Modal open={ytOpen} onClose={()=>setYtOpen(false)} title="YouTube'dan qidirish" width={480}>
        <div style={{display:'flex',gap:8,marginBottom:12}}>
          <input className="input" value={ytQ} onChange={e=>setYtQ(e.target.value)}
            placeholder="Qo'shiq nomini yozing..." style={{flex:1}}
            onKeyDown={e=>e.key==='Enter'&&doYtSearch()}/>
          <button className="btn btn-blue" onClick={doYtSearch} style={{flexShrink:0}}>
            {ytLoading?'...':'🔍'}
          </button>
        </div>
        {!YT_KEY && (
          <div style={{fontSize:12,color:'var(--text-muted)',background:'rgba(59,130,246,0.08)',padding:'8px 12px',borderRadius:8,marginBottom:10,lineHeight:1.5,border:'1px solid rgba(59,130,246,0.15)'}}>
            💡 To'liq qidiruv uchun <strong>VITE_YT_API_KEY</strong> kerak. Quyidagi natijalar bosib YouTube'da ochiladi.
          </div>
        )}
        <div style={{maxHeight:280,overflowY:'auto',display:'flex',flexDirection:'column',gap:6}}>
          {ytRes.map(r => (
            <div key={r.id} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',borderRadius:10,border:'1px solid rgba(59,130,246,0.15)',background:'rgba(59,130,246,0.05)'}}>
              {r.thumb
                ? <img src={r.thumb} alt="" style={{width:48,height:36,borderRadius:7,objectFit:'cover',flexShrink:0}}/>
                : <div style={{width:48,height:36,borderRadius:7,background:'var(--gray-200)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,flexShrink:0}}>🎵</div>
              }
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:500,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{r.title}</div>
                <div style={{fontSize:11,color:'var(--text-muted)',marginTop:1}}>{r.channel}</div>
              </div>
              <div style={{display:'flex',gap:4,flexShrink:0}}>
                <button className="btn btn-blue" style={{padding:'4px 8px',fontSize:11}} onClick={()=>addFromYt(r)}>+ Qo'shish</button>
                <a href={`https://youtu.be/${r.id}`} target="_blank" rel="noreferrer"
                  className="btn btn-glass" style={{padding:'4px 8px',fontSize:11,textDecoration:'none'}}>▶</a>
              </div>
            </div>
          ))}
          {!ytLoading&&ytRes.length===0&&ytQ&&(
            <div style={{textAlign:'center',padding:20,color:'var(--text-muted)',fontSize:14}}>Natija topilmadi</div>
          )}
        </div>
      </Modal>
    </div>
  )
}
