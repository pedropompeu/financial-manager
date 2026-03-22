import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { botaoPrimario, input } from '../components/ui/styles'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', senha: '' })
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  function atualizar(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function enviar(e) {
    e.preventDefault()
    setErro('')
    setCarregando(true)
    try {
      await login(form.email, form.senha)
      navigate('/dashboard')
    } catch {
      setErro('E-mail ou senha incorretos.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div style={{
        width: '420px', flexShrink: 0,
        background: '#1a1a2e',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '48px 40px',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '64px' }}>
            <div style={{
              width: '32px', height: '32px', background: '#0984e3',
              borderRadius: '4px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '16px',
            }}>F</div>
            <span style={{ color: '#fff', fontWeight: 600, fontSize: '16px' }}>FinancialManager</span>
          </div>
          <h2 style={{ color: '#fff', fontSize: '28px', fontWeight: 600, lineHeight: 1.3, marginBottom: '16px' }}>
            Controle financeiro para sua empresa
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px', lineHeight: 1.7 }}>
            Gerencie receitas, despesas e relatórios em tempo real. Simples, seguro e eficiente.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { icone: '✓', texto: 'Multi-empresa com dados isolados' },
            { icone: '✓', texto: 'Relatórios financeiros em tempo real' },
            { icone: '✓', texto: 'Acesso seguro com autenticação JWT' },
          ].map(({ icone, texto }) => (
            <div key={texto} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{
                width: '20px', height: '20px', borderRadius: '50%',
                background: '#00b894', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '11px', fontWeight: 700, flexShrink: 0,
              }}>{icone}</span>
              <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px' }}>{texto}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        flex: 1, background: '#e0e0da',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '48px',
      }}>
        <div style={{ width: '100%', maxWidth: '380px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 600, color: '#0d0d0d', marginBottom: '4px' }}>
            Entrar na sua conta
          </h1>
          <p style={{ fontSize: '13px', color: '#888', marginBottom: '32px' }}>
            Não tem conta?{' '}
            <Link to="/registro" style={{ color: '#0984e3', textDecoration: 'none', fontWeight: 500 }}>
              Criar organização
            </Link>
          </p>

          {erro && (
            <div style={{
              background: '#d6303120', border: '1px solid #d6303140',
              color: '#d63031', fontSize: '13px', borderRadius: '4px',
              padding: '10px 14px', marginBottom: '20px',
            }}>
              {erro}
            </div>
          )}

          <form onSubmit={enviar} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#444', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                E-mail
              </label>
              <input
                type="email" name="email" value={form.email}
                onChange={atualizar} required
                placeholder="seu@email.com"
                style={input}
                onFocus={e => e.target.style.borderColor = '#0984e3'}
                onBlur={e => e.target.style.borderColor = '#d0d0ca'}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#444', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Senha
              </label>
              <input
                type="password" name="senha" value={form.senha}
                onChange={atualizar} required
                placeholder="••••••••"
                style={input}
                onFocus={e => e.target.style.borderColor = '#0984e3'}
                onBlur={e => e.target.style.borderColor = '#d0d0ca'}
              />
            </div>
            <button
              type="submit" disabled={carregando}
              style={{ ...botaoPrimario, width: '100%', padding: '10px', marginTop: '8px', opacity: carregando ? 0.6 : 1 }}
              onMouseEnter={e => e.target.style.background = '#0773c5'}
              onMouseLeave={e => e.target.style.background = '#0984e3'}
            >
              {carregando ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
