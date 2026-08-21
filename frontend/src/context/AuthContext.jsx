import { createContext, useContext, useEffect, useState } from 'react'
import * as authApi from '../api/auth'
import { clearTokens, setTokens } from '../api/client'

const AuthContext = createContext(null)
const USER_KEY = 'tawakkal_user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(USER_KEY)
    if (saved) {
      try {
        setUser(JSON.parse(saved))
      } catch {
        localStorage.removeItem(USER_KEY)
      }
    }
    setReady(true)
  }, [])

  const persistUser = (u) => {
    localStorage.setItem(USER_KEY, JSON.stringify(u))
    setUser(u)
  }

  const sendOtp = async (phone) => {
    await authApi.sendOtp(phone)
    return true
  }

  const verifyOtp = async (phone, code) => {
    const { data } = await authApi.verifyOtp(phone, code)
    setTokens({ access: data.access, refresh: data.refresh })
    persistUser(data.user)
    return { ...data.user, isNewUser: data.is_new_user }
  }

  const setName = async (name) => {
    const { data } = await authApi.updateMe({ name })
    persistUser(data)
    return data
  }

  const logout = () => {
    clearTokens()
    localStorage.removeItem(USER_KEY)
    setUser(null)
  }

  const isAdmin = Boolean(user?.is_staff)

  return (
    <AuthContext.Provider value={{ user, ready, isAdmin, sendOtp, verifyOtp, setName, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
