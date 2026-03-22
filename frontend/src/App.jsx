import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Registro from './pages/Registro'
import Dashboard from './pages/Dashboard'

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
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Transações</h2>
            <p className="text-gray-500 text-sm">Em construção...</p>
          </div>
        </RotaProtegida>
      } />
      <Route path="/categorias" element={
        <RotaProtegida>
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Categorias</h2>
            <p className="text-gray-500 text-sm">Em construção...</p>
          </div>
        </RotaProtegida>
      } />
      <Route path="/usuarios" element={
        <RotaProtegida>
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Usuários</h2>
            <p className="text-gray-500 text-sm">Em construção...</p>
          </div>
        </RotaProtegida>
      } />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}
