import { useState, useEffect, useCallback } from 'react'

// ─── LocalStorage helpers ───────────────────────────────────────────────────
function ls(key, def) {
  try { return JSON.parse(localStorage.getItem(key) ?? JSON.stringify(def)) }
  catch { return def }
}
function lsSet(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)) } catch {}
}

// ─── User-scoped storage ────────────────────────────────────────────────────
export function ud(email, key, def) {
  return ls(`nx_${email}_${key}`, def)
}
export function sdFn(email, key, val) {
  lsSet(`nx_${email}_${key}`, val)
}

// ─── Auth hook ──────────────────────────────────────────────────────────────
export function useAuth() {
  const [user, setUser] = useState(() => ls('nx_me', null))
  const [users, setUsers] = useState(() => ls('nx_users', []))

  const login = useCallback((u) => {
    setUser(u)
    lsSet('nx_me', u)
  }, [])

  const register = useCallback((name, email, pass) => {
    const existing = ls('nx_users', [])
    if (existing.find(u => u.email === email)) throw new Error('Bu email allaqachon ro\'yxatdan o\'tgan')
    const initials = name.split(' ').map(x => x[0]).join('').slice(0, 2).toUpperCase()
    const newUser = { email, pass, name, initials, emoji: '😊', avatar: null }
    const updated = [...existing, newUser]
    lsSet('nx_users', updated)
    setUsers(updated)
    login(newUser)
  }, [login])

  const loginWithCredentials = useCallback((email, pass) => {
    const existing = ls('nx_users', [])
    const u = existing.find(u => u.email === email && u.pass === pass)
    if (!u) throw new Error('Email yoki parol noto\'g\'ri')
    login(u)
  }, [login])

  const loginGoogle = useCallback(() => {
    const u = { email: 'demo@nexus.app', name: 'Demo Foydalanuvchi', initials: 'DF', emoji: '😊', avatar: null, pass: 'g' }
    const existing = ls('nx_users', [])
    if (!existing.find(x => x.email === u.email)) {
      lsSet('nx_users', [...existing, u])
      setUsers([...existing, u])
    }
    login(u)
  }, [login])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('nx_me')
  }, [])

  const updateProfile = useCallback((updates) => {
    const existing = ls('nx_users', [])
    const updated = existing.map(u => u.email === user.email ? { ...u, ...updates } : u)
    lsSet('nx_users', updated)
    setUsers(updated)
    const newMe = { ...user, ...updates }
    setUser(newMe)
    lsSet('nx_me', newMe)
  }, [user])

  return { user, users, login, register, loginWithCredentials, loginGoogle, logout, updateProfile }
}

// ─── Per-user data hook ──────────────────────────────────────────────────────
export function useUserData(email, key, defaultValue) {
  const [data, setData] = useState(() => ud(email, key, defaultValue))

  const set = useCallback((val) => {
    const next = typeof val === 'function' ? val(data) : val
    sdFn(email, key, next)
    setData(next)
  }, [email, key, data])

  useEffect(() => {
    setData(ud(email, key, defaultValue))
  }, [email, key])

  return [data, set]
}
