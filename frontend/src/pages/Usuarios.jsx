import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'

const PERFIS = { admin: 'Administrador', colaborador: 'Colaborador' }

export default function Usuarios() {
  const { usuario } = useAuth()
  const [usuarios, setUsuarios] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    api.get('/api/auth/usuarios/')
      .then((res) => setUsuarios(res.data.results || res.data))
      .finally(() => setCarregando(false))
  }, [])

  const ehAdmin = usuario?.perfil === 'admin'

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Usuários</h2>
          <p className="text-sm text-gray-400 mt-0.5">{usuarios.length} membro{usuarios.length !== 1 ? 's' : ''} na organização</p>
        </div>
      </div>

      {!ehAdmin && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-lg px-4 py-3 mb-4">
          Apenas administradores podem gerenciar usuários.
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {['Nome', 'E-mail', 'Perfil', 'Membro desde'].map((col) => (
                <th key={col} className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {carregando ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400 text-sm">Carregando...</td></tr>
            ) : usuarios.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-semibold">
                      {u.nome.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-gray-700">{u.nome}</span>
                    {u.id === usuario?.id && (
                      <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">você</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                    u.perfil === 'admin'
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {PERFIS[u.perfil]}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs">
                  {new Date(u.criado_em).toLocaleDateString('pt-BR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
