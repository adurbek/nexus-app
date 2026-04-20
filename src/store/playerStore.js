// Global music player state — survives page navigation
// Uses a simple module-level singleton so audio keeps playing across views

let _audio = null
let _listeners = new Set()
let _state = {
  tracks: [],
  idx: 0,
  playing: false,
  progress: 0,
  elapsed: 0,
  volume: 0.8,
}

function notify() {
  _listeners.forEach(fn => fn({ ..._state }))
}

function getAudio() {
  if (!_audio) {
    _audio = new Audio()
    _audio.volume = _state.volume
    _audio.ontimeupdate = () => {
      if (!_audio.duration) return
      _state.elapsed = Math.floor(_audio.currentTime)
      _state.progress = (_audio.currentTime / _audio.duration) * 100
      notify()
    }
    _audio.onended = () => { skipNext() }
    _audio.onloadedmetadata = () => {
      const m = Math.floor(_audio.duration / 60)
      const s = Math.floor(_audio.duration % 60)
      const dur = `${m}:${String(s).padStart(2,'0')}`
      _state.tracks = _state.tracks.map((t,i) => i===_state.idx ? {...t, dur} : t)
      notify()
    }
  }
  return _audio
}

export function subscribe(fn) {
  _listeners.add(fn)
  fn({ ..._state })
  return () => _listeners.delete(fn)
}

export function getState() { return { ..._state } }

export function setTracks(tracks) {
  _state.tracks = tracks
  notify()
}

export function playAt(idx) {
  const t = _state.tracks[idx]
  if (!t) return
  _state.idx = idx
  _state.progress = 0
  _state.elapsed = 0
  _state.playing = true
  const a = getAudio()
  if (t.url) {
    a.src = t.url
    a.play().catch(() => {})
  } else {
    a.src = ''
    startFake()
  }
  notify()
}

let _fakeTimer = null
function startFake() {
  clearInterval(_fakeTimer)
  _fakeTimer = setInterval(() => {
    const cur = _state.tracks[_state.idx]
    const total = durToSec(cur?.dur || '3:00')
    _state.elapsed = Math.min(_state.elapsed + 1, total)
    _state.progress = (_state.elapsed / total) * 100
    if (_state.elapsed >= total) { skipNext(); return }
    notify()
  }, 1000)
}

export function togglePlay() {
  const a = getAudio()
  const cur = _state.tracks[_state.idx]
  if (_state.playing) {
    _state.playing = false
    a.pause()
    clearInterval(_fakeTimer)
  } else {
    _state.playing = true
    if (cur?.url && a.src) a.play().catch(() => {})
    else startFake()
  }
  notify()
}

export function skipPrev() {
  const len = _state.tracks.length
  if (!len) return
  playAt((_state.idx - 1 + len) % len)
}

export function skipNext() {
  const len = _state.tracks.length
  if (!len) return
  playAt((_state.idx + 1) % len)
}

export function seek(pct) {
  const a = getAudio()
  const cur = _state.tracks[_state.idx]
  if (cur?.url && a.duration) a.currentTime = (pct / 100) * a.duration
  _state.progress = pct
  _state.elapsed = Math.floor(durToSec(cur?.dur || '3:00') * pct / 100)
  notify()
}

export function setVolume(v) {
  _state.volume = v
  getAudio().volume = v
  notify()
}

function durToSec(d) {
  const [m,s] = (d||'3:00').split(':').map(Number)
  return (m||0)*60+(s||0)
}
