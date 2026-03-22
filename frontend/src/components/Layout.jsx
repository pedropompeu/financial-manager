import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const itensNav = [
  { label: 'Dashboard', path: '/dashboard', icone: '▦' },
  { label: 'Transações', path: '/transacoes', icone: '↕' },
  { label: 'Categorias', path: '/categorias', icone: '⊞' },
  { label: 'Usuários', path: '/usuarios', icone: '◉' },
]

export default function Layout({ children }) {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-56 bg-white border-r border-gray-100 flex flex-col">
        <div className="px-6 py-5 border-b border-gray-100">
          <h1 className="text-base font-semibold text-indigo-600">FinancialManager</h1>
          <p className="text-xs text-gray-400 mt-0.5 truncate">{usuario?.organizacao_nome}</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {itensNav.map(({ label, path, icone }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 font-medium'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`
              }
            >
              <span className="text-base">{icone}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-gray-100">
          <div className="px-3 py-2 mb-2">
            <p className="text-xs font-medium text-gray-700 truncate">{usuario?.nome}</p>
            <p className="text-xs text-gray-400 truncate">{usuario?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition"
          >
            Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}
