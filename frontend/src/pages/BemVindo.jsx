import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function BemVindo() {
  const { usuario } = useAuth()
  const navigate = useNavigate()

  return (
    <div style={{
      minHeight: '100vh', background: '#f0f0eb',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{ maxWidth: '560px', width: '100%', padding: '0 24px', textAlign: 'center' }}>

        <div style={{
          width: '64px', height: '64px', background: '#0984e3',
          borderRadius: '4px', display: 'flex', alignItems: 'center',
          justifyContent: 'center', color: '#fff', fontWeight: 700,
          fontSize: '28px', margin: '0 auto 32px',
        }}>F</div>

        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0d0d0d', marginBottom: '12px' }}>
          Bem-vindo ao FinancialManager{usuario?.nome ? `, ${usuario.nome.split(' ')[0]}` : ''}!
        </h1>

        <p style={{ fontSize: '15px', color: '#636e72', lineHeight: 1.7, marginBottom: '12px' }}>
          Sua organização <strong style={{ color: '#0d0d0d' }}>{usuario?.organizacao_nome}</strong> foi criada com sucesso.
        </p>

        <p style={{ fontSize: '14px', color: '#888', lineHeight: 1.7, marginBottom: '48px' }}>
          Vamos configurar tudo em 3 passos rápidos para você começar a controlar suas finanças.
        </p>

        <div style={{
          display: 'flex', justifyContent: 'center', gap: '12px',
          marginBottom: '48px',
        }}>
          {[
            { num: '1', label: 'Criar categoria' },
            { num: '2', label: 'Primeira transação' },
            { num: '3', label: 'Ver dashboard' },
          ].map(({ num, label }, i) => (
            <div key={num} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: i === 0 ? '#0984e3' : '#d8d8d2',
                  color: i === 0 ? '#fff' : '#888',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '13px', fontWeight: 600, margin: '0 auto 6px',
                }}>{num}</div>
                <span style={{ fontSize: '11px', color: '#888' }}>{label}</span>
              </div>
              {i < 2 && (
                <div style={{ width: '40px', height: '1px', background: '#d0d0ca', marginBottom: '18px' }} />
              )}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={() => navigate('/onboarding')}
            style={{
              background: '#0984e3', color: '#fff', border: 'none',
              padding: '12px 32px', borderRadius: '4px', fontSize: '14px',
              fontWeight: 600, cursor: 'pointer', width: '100%', maxWidth: '320px',
            }}
            onMouseEnter={e => e.target.style.background = '#0773c5'}
            onMouseLeave={e => e.target.style.background = '#0984e3'}
          >
            Começar configuração →
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              background: 'transparent', color: '#888', border: 'none',
              padding: '8px', fontSize: '13px', cursor: 'pointer',
            }}
          >
            Pular e ir direto ao dashboard
          </button>
        </div>
      </div>
    </div>
  )
}
