import { useState, useRef, useEffect, useCallback } from 'react'

// ChatGPT (OpenAI) yoki Claude — .env da qaysi key bo'lsa o'shani ishlatadi
const OPENAI_KEY = import.meta.env.VITE_OPENAI_API_KEY || ''
const CLAUDE_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY || ''

async function callAI(messages) {
  // OpenAI/ChatGPT ustuvor
  if (OPENAI_KEY) {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type':'application/json', 'Authorization':`Bearer ${OPENAI_KEY}` },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role:'system', content:"Siz o'zbek tilida javob beradigan aqlli yordamchisiz. Nexus ilovasining AI assistentisiz." },
          ...messages.map(m => ({ role: m.role==='assistant'?'assistant':'user', content: m.content }))
        ],
        max_tokens: 1024,
      })
    })
    if (!res.ok) { const e = await res.json().catch(()=>{}); throw new Error(e?.error?.message||`OpenAI xato ${res.status}`) }
    const d = await res.json()
    return d.choices?.[0]?.message?.content || 'Javob olinmadi.'
  }

  // Claude fallback
  if (CLAUDE_KEY) {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':'application/json',
        'x-api-key': CLAUDE_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: "Siz o'zbek tilida javob beradigan aqlli yordamchisiz. Nexus ilovasining AI assistentisiz. Qisqa va foydali javoblar bering.",
        messages: messages.map(m => ({ role: m.role, content: m.content })),
      })
    })
    if (!res.ok) { const e = await res.json().catch(()=>{}); throw new Error(e?.error?.message||`Claude xato ${res.status}`) }
    const d = await res.json()
    return d.content?.find(b => b.type==='text')?.text || 'Javob olinmadi.'
  }

  throw new Error('NO_KEY')
}

export default function AIPage() {
  const [msgs,    setMsgs]    = useState([])
  const [input,   setInput]   = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)
  const inputRef  = useRef(null)
  const abortRef  = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }) }, [msgs, loading])

  const send = useCallback(async () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    const history = [...msgs, { role:'user', content:text }]
    setMsgs(history)
    setLoading(true)
    try {
      const reply = await callAI(history)
      setMsgs([...history, { role:'assistant', content:reply }])
    } catch(e) {
      let msg = ''
      if (e.message === 'NO_KEY') {
        msg = '⚙️ AI ishlatish uchun:\n\n• ChatGPT uchun: VITE_OPENAI_API_KEY\n• Claude uchun: VITE_ANTHROPIC_API_KEY\n\nVercel > Settings > Environment Variables ga qo\'ying.'
      } else if (e.message.includes('401')) {
        msg = '🔑 API kalit noto\'g\'ri. Tekshiring.'
      } else if (e.message.includes('429')) {
        msg = '⏳ Juda ko\'p so\'rov. Biroz kuting.'
      } else {
        msg = `❌ ${e.message}`
      }
      setMsgs([...history, { role:'assistant', content:msg }])
    }
    setLoading(false)
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [input, loading, msgs])

  const suggestedQuestions = [
    "O'zbekiston haqida qiziqarli faktlar",
    'Bugungi kuni nima qilsam bo\'ladi?',
    'Ingliz tilini tez o\'rganish usullari',
    'Dasturlashni qayerdan boshlash kerak?',
  ]

  return (
    <div className="view-wrap" style={{flex:1,display:'flex',flexDirection:'column'}}>
      <div className="topbar">
        <div>
          <div className="page-title">AI Yordamchi</div>
          <div className="page-sub">{OPENAI_KEY ? 'ChatGPT (GPT-4o mini)' : CLAUDE_KEY ? 'Claude AI' : 'API kalit kerak'}</div>
        </div>
        {msgs.length > 0 && (
          <button className="btn btn-glass" onClick={() => { setMsgs([]); setLoading(false) }}>
            🗑 Tozalash
          </button>
        )}
      </div>

      <div className="card" style={{flex:1,display:'flex',flexDirection:'column',minHeight:400}}>
        {/* Header */}
        <div style={{display:'flex',alignItems:'center',gap:14,paddingBottom:14,borderBottom:'1px solid rgba(0,0,0,0.06)',marginBottom:14}}>
          <div style={{width:44,height:44,background:'linear-gradient(135deg,#3b82f6,#6366f1)',borderRadius:13,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,boxShadow:'0 4px 14px rgba(99,102,241,0.35)'}}>
            <svg width="20" height="20" fill="none" stroke="white" strokeWidth="1.7" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9"/><path d="M9 9h.01M15 9h.01"/><path d="M9.5 15a3.5 3.5 0 005 0"/>
            </svg>
          </div>
          <div>
            <div style={{fontWeight:700,fontSize:14,fontFamily:'var(--font-display)'}}>
              {OPENAI_KEY ? 'ChatGPT' : 'Nexus AI'}
            </div>
            <div style={{display:'flex',alignItems:'center',gap:5,fontSize:11,color:loading?'#f59e0b':'#16a34a',fontWeight:500,marginTop:2}}>
              <div style={{width:6,height:6,borderRadius:'50%',background:loading?'#f59e0b':'#22c55e',animation:'pulse 2s infinite'}}/>
              {loading ? 'Yozmoqda...' : 'Tayyor'}
            </div>
          </div>
          {loading && (
            <button onClick={() => setLoading(false)} style={{marginLeft:'auto',padding:'4px 10px',background:'rgba(0,0,0,0.05)',border:'1px solid rgba(0,0,0,0.1)',borderRadius:7,fontSize:12,cursor:'pointer',fontFamily:'var(--font)'}}>
              ⏹ To'xtatish
            </button>
          )}
        </div>

        {/* Messages */}
        <div style={{flex:1,overflowY:'auto',display:'flex',flexDirection:'column',gap:10,paddingRight:2,minHeight:200}}>
          {msgs.length === 0 && (
            <div>
              <div className="ai-bubble assistant" style={{marginBottom:14}}>
                Assalomu alaykum! 👋 Men sizning AI yordamchingizman. Har qanday savol bo'lsa yordam beraman!
              </div>
              <div style={{fontSize:11,color:'var(--text-muted)',marginBottom:8,fontWeight:600,letterSpacing:'0.05em',textTransform:'uppercase'}}>Mashhur savollar</div>
              <div style={{display:'flex',flexDirection:'column',gap:6}}>
                {suggestedQuestions.map((q,i) => (
                  <button key={i} onClick={() => { setInput(q); setTimeout(() => inputRef.current?.focus(), 50) }}
                    style={{padding:'9px 14px',background:'rgba(59,130,246,0.07)',border:'1px solid rgba(59,130,246,0.18)',borderRadius:10,fontSize:13,cursor:'pointer',textAlign:'left',color:'var(--text-primary)',fontFamily:'var(--font)',transition:'var(--tr)'}}>
                    💬 {q}
                  </button>
                ))}
              </div>
            </div>
          )}
          {msgs.map((m,i) => (
            <div key={i} className={`ai-bubble ${m.role}`}>{m.content}</div>
          ))}
          {loading && <div className="ai-typing"><span/><span/><span/></div>}
          <div ref={bottomRef}/>
        </div>

        {/* Input */}
        <div style={{display:'flex',gap:8,paddingTop:12,borderTop:'1px solid rgba(0,0,0,0.06)',marginTop:10}}>
          <input ref={inputRef} className="ai-input" value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Savolingizni yozing..."
            onKeyDown={e => e.key==='Enter' && !e.shiftKey && (e.preventDefault(), send())}
            disabled={loading}/>
          <button onClick={send} disabled={loading||!input.trim()}
            style={{padding:'11px 18px',background:'linear-gradient(135deg,#3b82f6,#6366f1)',color:'white',border:'none',borderRadius:12,fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:'var(--font-display)',transition:'var(--tr)',whiteSpace:'nowrap',opacity:loading||!input.trim()?0.5:1,boxShadow:loading||!input.trim()?'none':'0 4px 14px rgba(99,102,241,0.4)'}}>
            {loading ? '...' : '↑ Yuborish'}
          </button>
        </div>
      </div>
    </div>
  )
}
