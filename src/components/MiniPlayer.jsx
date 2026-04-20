import { useState, useEffect } from 'react'
import * as Player from '../store/playerStore'

export default function MiniPlayer({ currentView }) {
  const [ps, setPs] = useState(Player.getState())
  useEffect(() => Player.subscribe(s => setPs(s)), [])

  // Don't show on music page or when nothing playing
  if (currentView === 'music') return null
  if (!ps.playing && ps.elapsed === 0) return null
  const cur = ps.tracks[ps.idx]
  if (!cur) return null

  function toTime(s) {
    return `${Math.floor(s/60)}:${String(Math.floor(s)%60).padStart(2,'0')}`
  }

  return (
    <div style={{
      position:'fixed', bottom: currentView !== 'music' ? 'calc(env(safe-area-inset-bottom, 0px) + 72px)' : 16,
      left:'50%', transform:'translateX(-50%)',
      background:'rgba(12,12,10,0.92)',
      backdropFilter:'blur(24px)', WebkitBackdropFilter:'blur(24px)',
      border:'1px solid rgba(255,255,255,0.12)',
      borderRadius:16, padding:'10px 16px',
      display:'flex', alignItems:'center', gap:12,
      zIndex:80, minWidth:280, maxWidth:'calc(100vw - 32px)',
      boxShadow:'0 8px 32px rgba(0,0,0,0.3)',
      color:'white',
    }}>
      <span style={{fontSize:20,flexShrink:0}}>{cur.emoji||'🎵'}</span>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:12,fontWeight:600,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{cur.title}</div>
        <div style={{fontSize:10,opacity:.5,marginTop:1}}>{toTime(ps.elapsed)}</div>
      </div>
      <button onClick={Player.skipPrev} style={{background:'none',border:'none',color:'rgba(255,255,255,0.6)',cursor:'pointer',padding:'4px',fontSize:16}}>⏮</button>
      <button onClick={Player.togglePlay} style={{
        width:32,height:32,borderRadius:'50%',background:'white',color:'#0c0c0a',
        border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',
        fontSize:14,flexShrink:0,
      }}>
        {ps.playing ? '⏸' : '▶'}
      </button>
      <button onClick={Player.skipNext} style={{background:'none',border:'none',color:'rgba(255,255,255,0.6)',cursor:'pointer',padding:'4px',fontSize:16}}>⏭</button>
    </div>
  )
}
