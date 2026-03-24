import { Link } from 'react-router-dom'

export default function AssistenteIAPro() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ maxWidth: '480px', width: '100%', textAlign: 'center' }}>

        <div style={{
          width: '72px', height: '72px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #f39c1220, #e67e2220)',
          border: '2px solid #f39c1240',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px', fontSize: '28px',
        }}>✦</div>

        <div style={{
          display: 'inline-block', background: 'linear-gradient(135deg, #f39c12, #e67e22)',
          color: '#fff', fontSize: '11px', fontWeight: 700,
          padding: '4px 12px', borderRadius: '4px', marginBottom: '16px',
          letterSpacing: '0.08em',
        }}>
          FUNCIONALIDADE PRO
        </div>

        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0d0d0d', marginBottom: '12px' }}>
          Assistente Financeiro com IA
        </h2>

        <p style={{ fontSize: '14px', color: '#636e72', lineHeight: 1.7, marginBottom: '32px' }}>
          Faça perguntas em linguagem natural sobre suas finanças e receba análises inteligentes em tempo real. Disponível no Plano Pro.
        </p>

        <div style={{
          background: '#e8e8e2', borderRadius: '6px', padding: '20px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)', marginBottom: '32px', textAlign: 'left',
        }}>
          <p style={{ fontSize: '12px', fontWeight: 600, color: '#444', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
            O que você poderá perguntar:
          </p>
          {[
            '"Qual foi meu maior gasto em março?"',
            '"Como está meu saldo comparado ao mês anterior?"',
            '"Quanto gastei com alimentação este trimestre?"',
            '"Quais categorias consomem mais do meu orçamento?"',
          ].map((ex) => (
            <div key={ex} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
              <span style={{ color: '#f39c12', fontSize: '12px', fontWeight: 700, flexShrink: 0, marginTop: '1px' }}>✦</span>
              <span style={{ fontSize: '13px', color: '#636e72', fontStyle: 'italic' }}>{ex}</span>
            </div>
          ))}
        </div>

        <Link to="/#preços" style={{
          display: 'inline-block',
          background: 'linear-gradient(135deg, #f39c12, #e67e22)',
          color: '#fff', padding: '12px 32px', borderRadius: '4px',
          fontSize: '14px', fontWeight: 600, textDecoration: 'none',
          boxShadow: '0 4px 16px rgba(243,156,18,0.3)',
        }}>
          Fazer upgrade para Pro →
        </Link>

        <p style={{ fontSize: '12px', color: '#aaa', marginTop: '12px' }}>
          A partir de R$ 49/mês · Cancele quando quiser
        </p>
      </div>
    </div>
  )
}
