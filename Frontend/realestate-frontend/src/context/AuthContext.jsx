import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // restore session from localStorage on app load
    const savedToken = localStorage.getItem('re_token')
    const savedUser = localStorage.getItem('re_user')
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = (userData, authToken) => {
    setUser(userData)
    setToken(authToken)
    localStorage.setItem('re_token', authToken)
    localStorage.setItem('re_user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('re_token')
    localStorage.removeItem('re_user')
  }

  const isAdmin    = user?.role === 'ADMIN'
  const isAgent    = user?.role === 'AGENT'
  const isOwner    = user?.role === 'OWNER'
  const isBuyer    = user?.role === 'BUYER'
  const isSupport  = user?.role === 'SUPPORT'

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAdmin, isAgent, isOwner, isBuyer, isSupport }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
