import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const token = sessionStorage.getItem('access_token')
    if (token) {
      api.get('/api/auth/perfil/')
        .then((res) => setUsuario(res.data))
        .catch(() => sessionStorage.clear())
        .finally(() => setCarregando(false))
    } else {
      setCarregando(false)
    }
  }, [])

  async function login(email, senha) {
    const resposta = await api.post('/api/auth/login/', {
      email,
      password: senha,
    })
    sessionStorage.setItem('access_token', resposta.data.access)
    sessionStorage.setItem('refresh_token', resposta.data.refresh)
    const perfil = await api.get('/api/auth/perfil/')
    setUsuario(perfil.data)
    return perfil.data
  }

  async function registro(dados) {
    const resposta = await api.post('/api/auth/registro/', dados)
    return resposta.data
  }

  function logout() {
    sessionStorage.clear()
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, carregando, login, logout, registro }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  return context
}
