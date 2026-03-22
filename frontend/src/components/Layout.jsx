import { useState } from 'react'
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
  const [recolhida, setRecolhida] = useState(false)

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--cor-fundo)' }}>
      <aside style={{
        width: recolhida ? '56px' : '220px',
        background: 'var(--cor-secundaria)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.2s ease',
        flexShrink: 0,
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '16px 12px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: '56px',
        }}>
          {!recolhida && (
            <div style={{ overflow: 'hidden' }}>
              <div style={{ color: '#fff', fontWeight: 600, fontSize: '14px', whiteSpace: 'nowrap' }}>
                FinancialManager
              </div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '150px' }}>
                {usuario?.organizacao_nome}
              </div>
            </div>
          )}
          <button onClick={() => setRecolhida(!recolhida)} style={{
            background: 'rgba(255,255,255,0.08)',
            border: 'none',
            color: 'rgba(255,255,255,0.6)',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '4px',
            fontSize: '12px',
            flexShrink: 0,
            lineHeight: 1,
          }}>
            {recolhida ? '→' : '←'}
          </button>
        </div>

        <nav style={{ flex: 1, padding: '8px' }}>
          {itensNav.map(({ label, path, icone }) => (
            <NavLink key={path} to={path} style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '9px 10px',
              borderRadius: '4px',
              marginBottom: '2px',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: isActive ? 500 : 400,
              color: isActive ? '#fff' : 'rgba(255,255,255,0.5)',
              background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              transition: 'all 0.15s',
            })}>
              <span style={{ fontSize: '15px', flexShrink: 0 }}>{icone}</span>
              {!recolhida && label}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '8px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          {!recolhida && (
            <div style={{ padding: '8px 10px', marginBottom: '4px' }}>
              <div style={{ color: '#fff', fontSize: '12px', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {usuario?.nome}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {usuario?.email}
              </div>
            </div>
          )}
          <button onClick={handleLogout} style={{
            width: '100%',
            textAlign: recolhida ? 'center' : 'left',
            padding: '8px 10px',
            background: 'transparent',
            border: 'none',
            color: 'rgba(255,255,255,0.35)',
            cursor: 'pointer',
            fontSize: '12px',
            borderRadius: '4px',
            transition: 'all 0.15s',
          }}
            onMouseEnter={e => { e.target.style.color = '#d63031'; e.target.style.background = 'rgba(214,48,49,0.1)' }}
            onMouseLeave={e => { e.target.style.color = 'rgba(255,255,255,0.35)'; e.target.style.background = 'transparent' }}
          >
            {recolhida ? '✕' : 'Sair'}
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, padding: '32px', overflow: 'auto', minWidth: 0 }}>
        {children}
      </main>
    </div>
  )
}
