import { useState, useEffect } from 'react'
import { useAuth } from './store/useStore'
import * as Player from './store/playerStore'
import AuthPage   from './pages/AuthPage'
import HomePage   from './pages/HomePage'
import MusicPage  from './pages/MusicPage'
import LampPage   from './pages/LampPage'
import AIPage     from './pages/AIPage'
import SavePage   from './pages/SavePage'
import Sidebar    from './components/Sidebar'
import MobileNav  from './components/MobileNav'
import MiniPlayer from './components/MiniPlayer'

function lsGet(k,d){ try{return JSON.parse(localStorage.getItem(k)??JSON.stringify(d))}catch{return d} }
function lsSet(k,v){ try{localStorage.setItem(k,JSON.stringify(v))}catch{} }

const DEFAULT_TRACKS = [
  {id:1,title:'Lofi Study Beat',   artist:'ChillWave',emoji:'🎹',dur:'3:24',url:null,ytId:null},
  {id:2,title:"O'zbek klassikasi",artist:'Mushtariy', emoji:'🎻',dur:'4:10',url:null,ytId:null},
  {id:3,title:'Jazz Night',        artist:'Blue Note', emoji:'🎺',dur:'2:58',url:null,ytId:null},
  {id:4,title:'Deep Ambient',      artist:'Seashore',  emoji:'🌊',dur:'5:12',url:null,ytId:null},
  {id:5,title:'Lo-fi Hip Hop',     artist:'Nujabes',   emoji:'🎧',dur:'3:45',url:null,ytId:null},
]

function Dashboard({ user, logout, updateProfile }) {
  const [view, setView] = useState('home')
  const e = user.email
  const [tracks, setTracksS] = useState(() => lsGet(`nx_${e}_tracks`, DEFAULT_TRACKS))
  const [photos, setPhotosS] = useState(() => lsGet(`nx_${e}_photos`, []))
  const [notes,  setNotesS]  = useState(() => lsGet(`nx_${e}_notes_v2`, []))

  const setTracks = v => { const d=typeof v==='function'?v(tracks):v; lsSet(`nx_${e}_tracks`,d); setTracksS(d) }
  const setPhotos = v => { const d=typeof v==='function'?v(photos):v; lsSet(`nx_${e}_photos`,d); setPhotosS(d) }
  const setNotes  = v => { const d=typeof v==='function'?v(notes):v;  lsSet(`nx_${e}_notes_v2`,d); setNotesS(d) }

  useEffect(() => {
    setTracksS(lsGet(`nx_${e}_tracks`, DEFAULT_TRACKS))
    setPhotosS(lsGet(`nx_${e}_photos`, []))
    setNotesS(lsGet(`nx_${e}_notes_v2`, []))
  }, [e])

  // Init player tracks
  useEffect(() => { Player.setTracks(tracks) }, [])

  const handleLogout = () => { if(window.confirm('Akkauntdan chiqasizmi?')) logout() }

  return (
    <div className="app-layout">
      <Sidebar view={view} setView={setView} user={user} logout={handleLogout} updateProfile={updateProfile}/>
      <main className="main-area">
        {view==='home'  && <HomePage  user={user} tracks={tracks} photos={photos} notes={notes} setView={setView}/>}
        {view==='music' && <MusicPage tracks={tracks} setTracks={setTracks}/>}
        {view==='lamp'  && <LampPage  notes={notes} setNotes={setNotes}/>}
        {view==='ai'    && <AIPage/>}
        {view==='save'  && <SavePage  photos={photos} setPhotos={setPhotos}/>}
      </main>
      <MobileNav view={view} setView={setView} user={user} logout={handleLogout} updateProfile={updateProfile}/>
      <MiniPlayer currentView={view}/>
    </div>
  )
}

export default function App() {
  const { user, register, loginWithCredentials, loginGoogle, logout, updateProfile } = useAuth()
  if (!user) return <AuthPage onRegister={register} onLogin={loginWithCredentials} onGoogle={loginGoogle}/>
  return <Dashboard user={user} logout={logout} updateProfile={updateProfile}/>
}
