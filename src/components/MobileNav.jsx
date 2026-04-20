import { useState } from 'react'
import { Icons } from './Icons'
import ProfileModal from './ProfileModal'

const NAV = [
  { id:'home',  Icon:Icons.Home,  label:'Asosiy' },
  { id:'music', Icon:Icons.Music, label:'Musiqa' },
  { id:'lamp',  Icon:Icons.Lamp,  label:'Yozuv'  },
  { id:'ai',    Icon:Icons.AI,    label:'AI'      },
  { id:'save',  Icon:Icons.Photo, label:'Albom'   },
]

export default function MobileNav({ view, setView, user, logout, updateProfile }) {
  const [profileOpen, setProfileOpen] = useState(false)
  const grad = user?.gradient?.bg || 'linear-gradient(135deg,#667eea,#764ba2)'

  return (
    <>
      {/* Top bar */}
      <div className="mob-topbar">
        <div className="mob-topbar-logo">
          <div className="mob-topbar-icon">
            <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2.2" viewBox="0 0 24 24">
              <polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/>
            </svg>
          </div>
          <div className="mob-topbar-name">Nexus</div>
        </div>
        <div className="mob-topbar-avatar" onClick={() => setProfileOpen(true)}
          style={{background: user?.avatar ? 'transparent' : grad}}>
          {user?.avatar
            ? <img src={user.avatar} alt="av" style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'50%'}}/>
            : <span style={{fontSize:11,fontWeight:700,color:'white'}}>{user?.initials||'?'}</span>
          }
        </div>
      </div>

      {/* Bottom nav */}
      <nav className="mob-nav">
        {NAV.map(({id,Icon,label}) => (
          <div key={id} className={`m-nav-item ${view===id?'active':''}`} onClick={()=>setView(id)}>
            <Icon/><span className="m-nav-label">{label}</span>
          </div>
        ))}
      </nav>

      <ProfileModal open={profileOpen} onClose={()=>setProfileOpen(false)}
        user={user} updateProfile={updateProfile} logout={logout} showLogout/>
    </>
  )
}
