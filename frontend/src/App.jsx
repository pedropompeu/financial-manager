import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Login from './pages/Login'
import Registro from './pages/Registro'

function RotaProtegida({ children }) {
  const { usuario, carregando } = useAuth()
  if (carregando) return <div className="min-h-screen flex items-center justify-center text-gray-400">Carregando...</div>
  return usuario ? children : <Navigate to="/login" />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/dashboard" element={
        <RotaProtegida>
          <div className="p-8 text-gray-700">Dashboard — em construção</div>
        </RotaProtegida>
      } />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}
