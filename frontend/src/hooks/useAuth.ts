import { useState, useCallback } from 'react'

export function useAuth() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('access_token'))

  const saveToken = useCallback((newToken: string) => {
    localStorage.setItem('access_token', newToken)
    setToken(newToken)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('access_token')
    setToken(null)
  }, [])

  return { token, isAuthenticated: !!token, saveToken, logout }
}
