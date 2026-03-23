import { useState } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const itensNav = [
  { label: 'Dashboard', path: '/dashboard', icone: '▦' },
  { label: 'Transações', path: '/transacoes', icone: '↕' },
  { label: 'Categorias', path: '/categorias', icone: '⊞' },
  { label: 'Usuários', path: '/usuarios', icone: '◉' },
  { label: 'Configurações', path: '/configuracoes', icone: '⚙' },
]

const titulos = {
  '/dashboard': 'Dashboard',
  '/transacoes': 'Transações',
  '/categorias': 'Categorias',
  '/usuarios': 'Usuários',
  '/configuracoes': 'Configurações',
}

export default function Layout({ children }) {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [recolhida, setRecolhida] = useState(false)

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f0f0eb' }}>
      <aside style={{
        width: recolhida ? '56px' : '220px',
        background: '#1a1a2e',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.2s ease',
        flexShrink: 0,
        overflow: 'hidden',
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        zIndex: 100,
      }}>
        <div style={{
          padding: '0 12px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '56px',
          flexShrink: 0,
        }}>
          {!recolhida && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
              <div style={{
                width: '28px', height: '28px', background: '#0984e3',
                borderRadius: '4px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', color: '#fff', fontWeight: 700,
                fontSize: '14px', flexShrink: 0,
              }}>F</div>
              <span style={{ color: '#fff', fontWeight: 600, fontSize: '13px', whiteSpace: 'nowrap' }}>
                FinancialManager
              </span>
            </div>
          )}
          <button onClick={() => setRecolhida(!recolhida)} style={{
            background: 'rgba(255,255,255,0.06)',
            border: 'none', color: 'rgba(255,255,255,0.5)',
            cursor: 'pointer', padding: '6px', borderRadius: '4px',
            fontSize: '12px', flexShrink: 0, lineHeight: 1,
            transition: 'all 0.15s',
          }}
            onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.12)'}
            onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.06)'}
          >
            {recolhida ? '→' : '←'}
          </button>
        </div>

        {!recolhida && (
          <div style={{ padding: '12px 16px 8px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ fontSize: '10px', fontWeight: 500, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '2px' }}>
              Organização
            </p>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {usuario?.organizacao_nome}
            </p>
          </div>
        )}

        <nav style={{ flex: 1, padding: '8px' }}>
          {itensNav.map(({ label, path, icone }) => (
            <NavLink key={path} to={path} style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '9px 10px', borderRadius: '4px', marginBottom: '2px',
              textDecoration: 'none', fontSize: '13px',
              fontWeight: isActive ? 500 : 400,
              color: isActive ? '#fff' : 'rgba(255,255,255,0.45)',
              background: isActive ? 'rgba(9,132,227,0.25)' : 'transparent',
              borderLeft: isActive ? '2px solid #0984e3' : '2px solid transparent',
              whiteSpace: 'nowrap', overflow: 'hidden',
              transition: 'all 0.15s',
            })}>
              <span style={{ fontSize: '14px', flexShrink: 0 }}>{icone}</span>
              {!recolhida && label}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '8px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {!recolhida && (
            <div style={{ padding: '8px 10px 4px' }}>
              <p style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(255,255,255,0.7)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {usuario?.nome}
              </p>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {usuario?.email}
              </p>
            </div>
          )}
          <button onClick={handleLogout} style={{
            width: '100%', textAlign: recolhida ? 'center' : 'left',
            padding: '8px 10px', background: 'transparent', border: 'none',
            color: 'rgba(255,255,255,0.3)', cursor: 'pointer',
            fontSize: '12px', borderRadius: '4px', transition: 'all 0.15s',
            marginTop: '4px',
          }}
            onMouseEnter={e => { e.target.style.color = '#d63031'; e.target.style.background = 'rgba(214,48,49,0.1)' }}
            onMouseLeave={e => { e.target.style.color = 'rgba(255,255,255,0.3)'; e.target.style.background = 'transparent' }}
          >
            {recolhida ? '✕' : '← Sair'}
          </button>
        </div>
      </aside>

      <div style={{
        marginLeft: recolhida ? '56px' : '220px',
        flex: 1, display: 'flex', flexDirection: 'column',
        transition: 'margin-left 0.2s ease', minWidth: 0,
      }}>
        <header style={{
          height: '56px', background: '#e8e8e2',
          borderBottom: '1px solid #d0d0ca',
          display: 'flex', alignItems: 'center',
          padding: '0 32px', flexShrink: 0,
          position: 'sticky', top: 0, zIndex: 50,
        }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '15px', fontWeight: 600, color: '#0d0d0d' }}>
              {titulos[location.pathname] || 'FinancialManager'}
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '30px', height: '30px', borderRadius: '50%',
              background: '#0984e320', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '12px', fontWeight: 600, color: '#0984e3',
            }}>
              {usuario?.nome?.charAt(0).toUpperCase()}
            </div>
            <span style={{ fontSize: '12px', fontWeight: 500, color: '#444' }}>{usuario?.nome}</span>
          </div>
        </header>

        <main style={{ flex: 1, padding: '32px', overflow: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
