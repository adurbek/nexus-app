import { useState } from 'react'
import { Icons } from '../components/Icons'

export default function AuthPage({ onRegister, onLogin, onGoogle }) {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [err, setErr] = useState('')

  const submit = () => {
    setErr('')
    try {
      if (mode === 'register') {
        if (!name.trim()) return setErr('Ismingizni kiriting')
        if (!email.trim() || !pass) return setErr('Email va parol kiritng')
        onRegister(name.trim(), email.trim(), pass)
      } else {
        if (!email.trim() || !pass) return setErr('Email va parol kiritng')
        onLogin(email.trim(), pass)
      }
    } catch (e) {
      setErr(e.message)
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-wrap">
        <div className="auth-logo-row">
          <div className="auth-logo-box"><Icons.Logo /></div>
          <div className="auth-brand">Nexus</div>
        </div>
        <div className="auth-card">
          <div className="auth-heading">
            {mode === 'login' ? 'Xush kelibsiz' : 'Yangi profil oching'}
          </div>
          <div className="auth-sub">
            {mode === 'login' ? 'Hisobingizga kiring' : "Ma'lumotlaringizni kiriting"}
          </div>

          <div className="auth-tabs">
            <div className={`auth-tab ${mode === 'login' ? 'active' : ''}`} onClick={() => { setMode('login'); setErr('') }}>Kirish</div>
            <div className={`auth-tab ${mode === 'register' ? 'active' : ''}`} onClick={() => { setMode('register'); setErr('') }}>Ro'yxat</div>
          </div>

          {mode === 'register' && (
            <div className="field">
              <label className="field-label">Ism</label>
              <input className="input" type="text" placeholder="To'liq ismingiz" value={name} onChange={e => setName(e.target.value)} />
            </div>
          )}
          <div className="field">
            <label className="field-label">Email</label>
            <input className="input" type="email" placeholder="siz@email.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="field">
            <label className="field-label">Parol</label>
            <input className="input" type="password" placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()} />
          </div>

          {err && <div className="error-box">{err}</div>}

          <button className="auth-btn" onClick={submit}>
            {mode === 'login' ? 'Kirish' : "Ro'yxatdan o'tish"}
          </button>

          <div className="auth-sep">yoki</div>

          <button className="google-btn" onClick={onGoogle}>
            <Icons.Google />
            Google bilan kirish
          </button>
        </div>
      </div>
    </div>
  )
}
