import { useEffect, useRef, useState } from 'react'

export default function LampPage({ notes, setNotes }) {
  const saved   = Array.isArray(notes) ? notes : []
  const edRef   = useRef(null)
  const editRef = useRef(null)
  const [editIdx, setEditIdx] = useState(null)
  const [status,  setStatus]  = useState('')
  const [wc,      setWc]      = useState(0)

  useEffect(()=>{
    const draft = localStorage.getItem('nx_draft')||''
    if(edRef.current) edRef.current.innerHTML = draft
    countWords()
  },[])

  function countWords(){
    const t = edRef.current?.innerText||''
    setWc(t.trim().split(/\s+/).filter(Boolean).length)
  }

  function onInput(){
    localStorage.setItem('nx_draft', edRef.current?.innerHTML||'')
    countWords()
  }

  function fmt(cmd){ document.execCommand(cmd,false,null); edRef.current?.focus(); onInput() }
  function fmtB(tag){ document.execCommand('formatBlock',false,tag); edRef.current?.focus(); onInput() }

  function saveNote(){
    const html = edRef.current?.innerHTML||''
    const text = edRef.current?.innerText?.trim()||''
    if(!text) return
    const note = {
      id: Date.now(), html, text,
      preview: text.slice(0,90),
      date: new Date().toLocaleString('uz-UZ',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}),
    }
    setNotes([...saved, note])
    edRef.current.innerHTML = ''
    localStorage.removeItem('nx_draft')
    setWc(0)
    setStatus('✓ Saqlandi')
    setTimeout(()=>setStatus(''),2000)
  }

  function delNote(id){ if(confirm("O'chirasizmi?")) setNotes(saved.filter(n=>n.id!==id)) }

  function startEdit(i){
    setEditIdx(i)
    setTimeout(()=>{ if(editRef.current) editRef.current.innerHTML=saved[i].html },30)
  }

  function saveEdit(){
    if(editIdx===null) return
    const html = editRef.current?.innerHTML||''
    const text = editRef.current?.innerText?.trim()||''
    if(!text) return
    setNotes(saved.map((n,i)=>i===editIdx
      ? {...n,html,text,preview:text.slice(0,90),date:n.date+' (tahrirlandi)'}
      : n
    ))
    setEditIdx(null)
  }

  return (
    <div className="view-wrap">
      <div className="topbar">
        <div>
          <div className="page-title">Yozuv daftari</div>
          <div className="page-sub">{saved.length} ta yozuv</div>
        </div>
        {status && <div className="status-pill" style={{color:'#16a34a'}}>{status}</div>}
      </div>

      {/* New note editor */}
      <div className="card" style={{padding:0,overflow:'hidden'}}>
        <div className="nt-toolbar">
          {[['bold','B'],['italic','I'],['underline','U']].map(([c,l])=>(
            <button key={c} className="nt-btn" onMouseDown={e=>{e.preventDefault();fmt(c)}}>
              {c==='bold'?<b>{l}</b>:c==='italic'?<i>{l}</i>:<u>{l}</u>}
            </button>
          ))}
          <div className="nt-sep"/>
          <button className="nt-btn" onMouseDown={e=>{e.preventDefault();fmtB('h2')}}>H1</button>
          <button className="nt-btn" onMouseDown={e=>{e.preventDefault();fmtB('h3')}}>H2</button>
          <div className="nt-sep"/>
          <button className="nt-btn" onMouseDown={e=>{e.preventDefault();fmt('insertUnorderedList')}}>• Ro'yxat</button>
          <button className="nt-btn" onMouseDown={e=>{e.preventDefault();fmt('insertOrderedList')}}>1. Tartibli</button>
          <div className="nt-sep"/>
          <button className="nt-btn" onMouseDown={e=>{e.preventDefault();fmtB('blockquote')}}>❝ Iqtibos</button>
        </div>
        <div ref={edRef} className="notepad-editor" contentEditable suppressContentEditableWarning
          data-placeholder="Yangi yozuvni boshlang..." onInput={onInput}
          style={{minHeight:130}}/>
        <div className="nt-footer">
          <span className="nt-footer-info">{wc} ta so'z</span>
          <button onClick={saveNote} style={{
            padding:'8px 20px',background:'var(--black)',color:'white',border:'none',
            borderRadius:8,fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:'var(--font)',transition:'var(--tr)',
          }}>Saqlash ↓</button>
        </div>
      </div>

      {/* Saved notes — newest first */}
      {[...saved].reverse().map((note, ri)=>{
        const ai = saved.length-1-ri
        const isEdit = editIdx===ai
        return (
          <div key={note.id} className="note-saved-card">
            {isEdit ? (
              <>
                <div className="nt-toolbar" style={{borderRadius:0}}>
                  <button className="nt-btn" onMouseDown={e=>{e.preventDefault();document.execCommand('bold')}}><b>B</b></button>
                  <button className="nt-btn" onMouseDown={e=>{e.preventDefault();document.execCommand('italic')}}><i>I</i></button>
                  <button className="nt-btn" onMouseDown={e=>{e.preventDefault();document.execCommand('underline')}}><u>U</u></button>
                </div>
                <div ref={editRef} className="notepad-editor" contentEditable suppressContentEditableWarning style={{minHeight:90}}/>
                <div className="nt-footer">
                  <button className="nt-clear" onClick={()=>setEditIdx(null)}>Bekor</button>
                  <button onClick={saveEdit} style={{padding:'6px 16px',background:'var(--black)',color:'white',border:'none',borderRadius:7,fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:'var(--font)'}}>Saqlash</button>
                </div>
              </>
            ) : (
              <div style={{padding:'16px 18px'}}>
                <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:8,marginBottom:10}}>
                  <div style={{fontSize:11,color:'var(--text-muted)',paddingTop:2}}>{note.date}</div>
                  <div style={{display:'flex',gap:5,flexShrink:0}}>
                    <button onClick={()=>startEdit(ai)} style={{
                      padding:'4px 10px',background:'rgba(0,0,0,0.04)',border:'1px solid rgba(0,0,0,0.1)',
                      borderRadius:6,fontSize:11,fontWeight:600,cursor:'pointer',color:'var(--text-secondary)',fontFamily:'var(--font)',
                    }}>✎ Tahrirlash</button>
                    <button onClick={()=>delNote(note.id)} style={{
                      padding:'4px 8px',background:'rgba(220,38,38,0.06)',border:'1px solid #fecaca',
                      borderRadius:6,fontSize:11,cursor:'pointer',color:'#dc2626',fontFamily:'var(--font)',
                    }}>✕</button>
                  </div>
                </div>
                <div className="notepad-editor"
                  dangerouslySetInnerHTML={{__html:note.html}}
                  style={{padding:0,minHeight:'unset',pointerEvents:'none',fontSize:14}}/>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
