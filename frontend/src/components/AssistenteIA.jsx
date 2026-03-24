import { useState, useRef, useEffect } from 'react'
import api from '../services/api'

export default function AssistenteIA({ resumo, despesas, receitas, mes, ano }) {
  const [aberto, setAberto] = useState(false)
  const [mensagens, setMensagens] = useState([
    {
      role: 'assistant',
      content: 'Olá! Sou o Assistente IA. Posso analisar seus dados, encontrar padrões de gastos e dar dicas financeiras personalizadas. Esta é uma funcionalidade exclusiva do Plano Pro. Deseja fazer um upgrade para começar a economizar agora?'
    }
  ])
  const [input, setInput] = useState('')
  const [carregando, setCarregando] = useState(false)
  const fimRef = useRef(null)

  useEffect(() => {
    if (fimRef.current) {
      fimRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [mensagens])

  const meses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

  async function enviar(e) {
    e.preventDefault()
    if (!input.trim() || carregando) return

    const pergunta = input.trim()
    setInput('')
    setMensagens(prev => [...prev, { role: 'user', content: pergunta }])
    setCarregando(true)

    try {
      const contexto = `
Você é um assistente financeiro especializado. Analise os dados financeiros abaixo e responda de forma clara, objetiva e em português.

PERÍODO ANALISADO: ${meses[mes - 1]} de ${ano}

RESUMO FINANCEIRO:
- Saldo atual: R$ ${resumo?.saldo?.toFixed(2) || '0,00'}
- Total de receitas: R$ ${resumo?.total_receitas?.toFixed(2) || '0,00'}
- Total de despesas: R$ ${resumo?.total_despesas?.toFixed(2) || '0,00'}

RECEITAS POR CATEGORIA:
${receitas.length > 0
  ? receitas.map(r => `- ${r.categoria_nome}: R$ ${Number(r.total).toFixed(2)}`).join('\n')
  : '- Nenhuma receita no período'}

DESPESAS POR CATEGORIA:
${despesas.length > 0
  ? despesas.map(d => `- ${d.categoria_nome}: R$ ${Number(d.total).toFixed(2)}`).join('\n')
  : '- Nenhuma despesa no período'}

Responda de forma direta e use formatação simples. Se precisar calcular percentuais ou comparações, faça-o com base nos dados acima. Limite sua resposta a 3 parágrafos curtos no máximo.
      `.trim()

      const historial = mensagens
        .filter((m, i) => !(m.role === 'assistant' && i === 0))
        .map(m => ({ role: m.role, content: m.content }))

      const res = await api.post('/api/relatorios/assistente/', {
        contexto,
        mensagens: [...historial, { role: 'user', content: pergunta }],
      })
      const resposta = res.data.resposta || 'Não consegui processar sua pergunta.'
      setMensagens(prev => [...prev, { role: 'assistant', content: resposta }])
    } catch {
      setMensagens(prev => [...prev, { role: 'assistant', content: 'Erro ao conectar com o assistente. Tente novamente.' }])
    } finally {
      setCarregando(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setAberto(!aberto)}
        style={{
          position: 'fixed', bottom: '28px', right: '28px',
          width: '52px', height: '52px', borderRadius: '50%',
          background: '#1a1a2e', border: '2px solid #0984e3',
          color: '#fff', fontSize: '22px', cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(9,132,227,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 200, transition: 'all 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        title="Assistente financeiro IA"
      >
        {aberto ? '✕' : '✦'}
      </button>

      {aberto && (
        <div style={{
          position: 'fixed', bottom: '92px', right: '28px',
          width: '360px', height: '480px',
          background: '#e8e8e2', borderRadius: '8px',
          boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
          display: 'flex', flexDirection: 'column',
          zIndex: 200, overflow: 'hidden',
          border: '1px solid #d0d0ca',
        }}>
          <div style={{
            background: '#1a1a2e', padding: '14px 16px',
            display: 'flex', alignItems: 'center', gap: '10px',
          }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: '#0984e320', border: '1px solid #0984e360',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px', color: '#0984e3',
            }}>✦</div>
            <div>
              <p style={{ color: '#fff', fontSize: '13px', fontWeight: 600 }}>Assistente Financeiro</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>
                {meses[mes - 1]} {ano}
              </p>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {mensagens.map((msg, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}>
                <div style={{
                  maxWidth: '85%', padding: '10px 14px', borderRadius: '8px',
                  fontSize: '13px', lineHeight: 1.5,
                  background: msg.role === 'user' ? '#0984e3' : '#d8d8d2',
                  color: msg.role === 'user' ? '#fff' : '#0d0d0d',
                  borderBottomRightRadius: msg.role === 'user' ? '2px' : '8px',
                  borderBottomLeftRadius: msg.role === 'assistant' ? '2px' : '8px',
                }}>
                  {msg.content}
                </div>
              </div>
            ))}
            {carregando && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ background: '#d8d8d2', padding: '10px 14px', borderRadius: '8px', borderBottomLeftRadius: '2px', fontSize: '13px', color: '#888' }}>
                  Analisando seus dados...
                </div>
              </div>
            )}
            <div ref={fimRef} />
          </div>

          <form onSubmit={enviar} style={{ padding: '12px', borderTop: '1px solid #d0d0ca', display: 'flex', gap: '8px' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Pergunte sobre suas finanças..."
              disabled={carregando}
              style={{
                flex: 1, border: '1px solid #d0d0ca', borderRadius: '4px',
                padding: '8px 12px', fontSize: '13px', background: '#f0f0eb',
                outline: 'none', color: '#0d0d0d',
              }}
              onFocus={e => e.target.style.borderColor = '#0984e3'}
              onBlur={e => e.target.style.borderColor = '#d0d0ca'}
            />
            <button type="submit" disabled={carregando || !input.trim()} style={{
              background: '#0984e3', color: '#fff', border: 'none',
              borderRadius: '4px', padding: '8px 14px', fontSize: '13px',
              cursor: 'pointer', fontWeight: 500,
              opacity: carregando || !input.trim() ? 0.5 : 1,
            }}>
              →
            </button>
          </form>
        </div>
      )}
    </>
  )
}
