import { useRef, useState, useEffect } from 'react'
import Modal from '../components/Modal'
import { Icons } from '../components/Icons'

export default function SavePage({ photos, setPhotos }) {
  const fileRef   = useRef()
  const videoRef  = useRef()
  const canvasRef = useRef()
  const [camOpen,  setCamOpen]  = useState(false)
  const [stream,   setStream]   = useState(null)
  const [camReady, setCamReady] = useState(false)
  const [camErr,   setCamErr]   = useState('')

  useEffect(()=>{
    if(!camOpen) return
    setCamReady(false); setCamErr('')
    navigator.mediaDevices?.getUserMedia({video:{facingMode:'environment'},audio:false})
      .then(s=>{
        setStream(s)
        const v = videoRef.current
        if(v){
          v.srcObject = s
          v.onloadedmetadata = ()=>{ v.play(); setCamReady(true) }
        }
      })
      .catch(()=>setCamErr("Kameraga ruxsat yo'q."))
    return ()=>{}
  },[camOpen])

  function closeCam(){
    stream?.getTracks().forEach(t=>t.stop())
    setStream(null); setCamOpen(false); setCamErr(''); setCamReady(false)
  }

  function snap(){
    const v=videoRef.current, c=canvasRef.current; if(!v||!c) return
    c.width=v.videoWidth||640; c.height=v.videoHeight||480
    c.getContext('2d').drawImage(v,0,0,c.width,c.height)
    addPhoto(c.toDataURL('image/jpeg',0.92))
    closeCam()
  }

  function handleFiles(e){
    Array.from(e.target.files||[]).forEach(file=>{
      if(!file.type.startsWith('image/')) return
      const reader = new FileReader()
      reader.onload = ev=>{
        const result = ev.target?.result
        if(result && typeof result==='string' && result.length>100) addPhoto(result)
      }
      reader.readAsDataURL(file)
    })
    e.target.value=''
  }

  function addPhoto(data){
    if(!data||data.length<100) return
    setPhotos(prev=>[...prev,{data,time:Date.now()}])
  }

  function delPhoto(i){
    if(!confirm("Rasmni o'chirasizmi?")) return
    setPhotos(prev=>prev.filter((_,j)=>j!==i))
  }

  return (
    <div className="view-wrap">
      <div className="topbar">
        <div>
          <div className="page-title">Fotoalbom</div>
          <div className="page-sub">{photos.length} ta rasm</div>
        </div>
        <div style={{display:'flex',gap:8}}>
          <button className="btn btn-black" onClick={()=>setCamOpen(true)}>
            <Icons.Camera/> Rasm olish
          </button>
          <label className="btn btn-outline" style={{cursor:'pointer'}}>
            <Icons.Upload/> Yuklash
            <input ref={fileRef} type="file" accept="image/*" multiple style={{display:'none'}} onChange={handleFiles}/>
          </label>
        </div>
      </div>

      <div className="card">
        {photos.length===0 ? (
          <div className="photo-empty">
            <div className="photo-empty-ico">📷</div>
            <p>Hali rasm yo'q.<br/>Kamera yoki galereyadаn qo'shing.</p>
          </div>
        ) : (
          <div className="photo-grid">
            {photos.map((p,i)=>(
              <div key={p.time||i} className="photo-cell">
                <img
                  src={p.data} alt={`rasm ${i+1}`} loading="lazy"
                  style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}
                  onError={e=>{e.target.style.opacity='0'}}
                />
                <div className="photo-overlay">
                  <button className="photo-del" onClick={()=>delPhoto(i)}>✕</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Camera modal */}
      <Modal open={camOpen} onClose={closeCam} title="Kamera" width={500}>
        {camErr ? (
          <>
            <div className="error-box" style={{marginBottom:14}}>{camErr}</div>
            <label className="btn btn-black" style={{width:'100%',justifyContent:'center',cursor:'pointer'}}>
              📁 Galereyadаn yuklash
              <input type="file" accept="image/*" style={{display:'none'}} onChange={e=>{handleFiles(e);closeCam()}}/>
            </label>
          </>
        ):(
          <>
            <div style={{background:'#000',borderRadius:12,overflow:'hidden',marginBottom:14,minHeight:200,position:'relative'}}>
              <video ref={videoRef} autoPlay playsInline muted
                style={{width:'100%',maxHeight:300,display:'block',objectFit:'cover'}}/>
              {!camReady&&(
                <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontSize:14,background:'#111'}}>
                  Kamera yuklanmoqda...
                </div>
              )}
            </div>
            <canvas ref={canvasRef} style={{display:'none'}}/>
            <div className="modal-row">
              <button className="btn btn-outline" onClick={closeCam} style={{flex:1}}>Bekor</button>
              <button className="btn btn-black" onClick={snap} disabled={!camReady} style={{flex:1}}>📷 Rasm ol</button>
            </div>
          </>
        )}
      </Modal>
    </div>
  )
}
