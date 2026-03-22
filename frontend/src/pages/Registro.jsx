import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { botaoPrimario, input } from '../components/ui/styles'

export default function Registro() {
  const { registro } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ nome_organizacao: '', nome_usuario: '', email: '', senha: '' })
  const [erros, setErros] = useState({})
  const [carregando, setCarregando] = useState(false)

  function atualizar(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function enviar(e) {
    e.preventDefault()
    setErros({})
    setCarregando(true)
    try {
      await registro(form)
      navigate('/login')
    } catch (err) {
      if (err.response?.data) setErros(err.response.data)
      else setErros({ geral: 'Erro ao criar organização.' })
    } finally {
      setCarregando(false)
    }
  }

  const campos = [
    { label: 'Nome da organização', name: 'nome_organizacao', type: 'text', placeholder: 'Minha Empresa Ltda' },
    { label: 'Seu nome', name: 'nome_usuario', type: 'text', placeholder: 'João Silva' },
    { label: 'E-mail', name: 'email', type: 'email', placeholder: 'joao@empresa.com' },
    { label: 'Senha', name: 'senha', type: 'password', placeholder: '••••••••' },
  ]

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
            Comece a controlar suas finanças hoje
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px', lineHeight: 1.7 }}>
            Configure sua empresa em menos de 2 minutos e tenha controle total do seu fluxo de caixa.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { icone: '✓', texto: 'Cadastro gratuito' },
            { icone: '✓', texto: 'Sem cartão de crédito' },
            { icone: '✓', texto: 'Dados 100% seguros' },
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
            Criar sua organização
          </h1>
          <p style={{ fontSize: '13px', color: '#888', marginBottom: '32px' }}>
            Já tem conta?{' '}
            <Link to="/login" style={{ color: '#0984e3', textDecoration: 'none', fontWeight: 500 }}>
              Entrar
            </Link>
          </p>

          {erros.geral && (
            <div style={{
              background: '#d6303120', border: '1px solid #d6303140',
              color: '#d63031', fontSize: '13px', borderRadius: '4px',
              padding: '10px 14px', marginBottom: '20px',
            }}>
              {erros.geral}
            </div>
          )}

          <form onSubmit={enviar} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {campos.map(({ label, name, type, placeholder }) => (
              <div key={name}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#444', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {label}
                </label>
                <input
                  type={type} name={name} value={form[name]}
                  onChange={atualizar} required placeholder={placeholder}
                  style={input}
                  onFocus={e => e.target.style.borderColor = '#0984e3'}
                  onBlur={e => e.target.style.borderColor = '#d0d0ca'}
                />
                {erros[name] && <p style={{ color: '#d63031', fontSize: '11px', marginTop: '4px' }}>{erros[name]}</p>}
              </div>
            ))}
            <button
              type="submit" disabled={carregando}
              style={{ ...botaoPrimario, width: '100%', padding: '10px', marginTop: '8px', opacity: carregando ? 0.6 : 1 }}
              onMouseEnter={e => e.target.style.background = '#0773c5'}
              onMouseLeave={e => e.target.style.background = '#0984e3'}
            >
              {carregando ? 'Criando...' : 'Criar organização'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
