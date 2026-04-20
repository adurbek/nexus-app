import { useState } from 'react'
import { Icons } from './Icons'
import ProfileModal from './ProfileModal'

const NAV = [
  { id:'home',  Icon:Icons.Home,  label:'Asosiy' },
  { id:'music', Icon:Icons.Music, label:'Musiqa' },
  { id:'lamp',  Icon:Icons.Lamp,  label:'Yozuv daftari' },
  { id:'ai',    Icon:Icons.AI,    label:'AI Yordamchi' },
  { id:'save',  Icon:Icons.Photo, label:'Fotoalbom' },
]

export default function Sidebar({ view, setView, user, logout, updateProfile }) {
  const [profileOpen, setProfileOpen] = useState(false)
  const grad = user?.gradient?.bg || 'linear-gradient(135deg,#667eea,#764ba2)'

  return (
    <>
      <nav className="sidebar">
        <div className="s-logo">
          <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2.2" viewBox="0 0 24 24">
            <polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/>
          </svg>
        </div>
        {NAV.map(({id,Icon,label}) => (
          <div key={id} className={`s-nav-item tooltip-wrap ${view===id?'active':''}`} onClick={()=>setView(id)}>
            <Icon/>
            <span className="tooltip">{label}</span>
          </div>
        ))}
        <div className="s-spacer"/>
        <div className="s-divider"/>
        <div className="s-action tooltip-wrap" onClick={logout}>
          <Icons.Logout/>
          <span className="tooltip">Chiqish</span>
        </div>
        <div className="s-avatar-btn tooltip-wrap" onClick={()=>setProfileOpen(true)}
          style={{background: user?.avatar ? 'transparent' : grad}}>
          {user?.avatar
            ? <img src={user.avatar} alt="av"/>
            : <span style={{fontSize:11,fontWeight:700,color:'white'}}>{user?.initials||'?'}</span>
          }
          <span className="tooltip">Profil</span>
        </div>
      </nav>
      <ProfileModal open={profileOpen} onClose={()=>setProfileOpen(false)}
        user={user} updateProfile={updateProfile} logout={logout} showLogout/>
    </>
  )
}
