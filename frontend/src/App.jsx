import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Registro from './pages/Registro'
import Dashboard from './pages/Dashboard'
import Transacoes from './pages/Transacoes'
import Usuarios from './pages/Usuarios'
import Categorias from './pages/Categorias'

function RotaProtegida({ children }) {
  const { usuario, carregando } = useAuth()
  if (carregando) return (
    <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">
      Carregando...
    </div>
  )
  return usuario ? <Layout>{children}</Layout> : <Navigate to="/login" />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/dashboard" element={
        <RotaProtegida>
          <Dashboard />
        </RotaProtegida>
      } />
      <Route path="/transacoes" element={
        <RotaProtegida>
          <Transacoes />
        </RotaProtegida>
      } />
      <Route path="/categorias" element={
        <RotaProtegida>
          <Categorias />
        </RotaProtegida>
      } />
      <Route path="/usuarios" element={
        <RotaProtegida>
          <Usuarios />
        </RotaProtegida>
      } />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}
