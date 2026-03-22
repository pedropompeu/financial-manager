import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

const PASSOS = ['Criar categoria', 'Primeira transação', 'Tudo pronto!']

export default function Onboarding() {
  const navigate = useNavigate()
  const [passo, setPasso] = useState(0)
  const [categoria, setCategoria] = useState({ nome: '', cor: '#0984e3' })
  const [transacao, setTransacao] = useState({
    descricao: '', valor: '', tipo: 'receita',
    data: new Date().toISOString().split('T')[0], categoria: '',
  })
  const [categoriaCriada, setCategoriaCriada] = useState(null)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')

  async function criarCategoria(e) {
    e.preventDefault()
    setErro('')
    setCarregando(true)
    try {
      const res = await api.post('/api/categorias/', categoria)
      setCategoriaCriada(res.data)
      setPasso(1)
    } catch (err) {
      setErro(err.response?.data?.nome || 'Erro ao criar categoria.')
    } finally {
      setCarregando(false)
    }
  }

  async function criarTransacao(e) {
    e.preventDefault()
    setErro('')
    setCarregando(true)
    try {
      await api.post('/api/transacoes/', {
        ...transacao,
        categoria: categoriaCriada?.id || null,
      })
      setPasso(2)
    } catch {
      setErro('Erro ao criar transação.')
    } finally {
      setCarregando(false)
    }
  }

  const inputStyle = {
    width: '100%', border: '1px solid #d0d0ca', borderRadius: '4px',
    padding: '9px 12px', fontSize: '13px', color: '#0d0d0d',
    background: '#f0f0eb', outline: 'none',
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#f0f0eb',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Inter', sans-serif", padding: '24px',
    }}>
      <div style={{ maxWidth: '480px', width: '100%' }}>

        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            {PASSOS.map((label, i) => (
              <span key={i} style={{
                fontSize: '11px', fontWeight: i === passo ? 600 : 400,
                color: i <= passo ? '#0984e3' : '#aaa',
              }}>{label}</span>
            ))}
          </div>
          <div style={{ height: '4px', background: '#d0d0ca', borderRadius: '2px' }}>
            <div style={{
              height: '4px', borderRadius: '2px', background: '#0984e3',
              width: `${((passo) / (PASSOS.length - 1)) * 100}%`,
              transition: 'width 0.4s ease',
            }} />
          </div>
        </div>

        <div style={{
          background: '#e8e8e2', borderRadius: '6px', padding: '36px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
        }}>
          {passo === 0 && (
            <>
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#0d0d0d', marginBottom: '8px' }}>
                Crie sua primeira categoria
              </h2>
              <p style={{ fontSize: '13px', color: '#888', marginBottom: '28px', lineHeight: 1.6 }}>
                Categorias ajudam a organizar suas receitas e despesas. Ex: Alimentação, Transporte, Salário.
              </p>
              {erro && (
                <div style={{ background: '#d6303120', color: '#d63031', fontSize: '13px', borderRadius: '4px', padding: '10px 14px', marginBottom: '16px' }}>
                  {erro}
                </div>
              )}
              <form onSubmit={criarCategoria} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#444', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Nome da categoria
                  </label>
                  <input
                    type="text" required value={categoria.nome}
                    onChange={e => setCategoria({ ...categoria, nome: e.target.value })}
                    placeholder="Ex: Alimentação"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#444', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Cor
                  </label>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {['#0984e3', '#00b894', '#d63031', '#f39c12', '#6c5ce7', '#fd79a8', '#00cec9', '#2d3436'].map(cor => (
                      <button key={cor} type="button"
                        onClick={() => setCategoria({ ...categoria, cor })}
                        style={{
                          width: '28px', height: '28px', borderRadius: '50%',
                          background: cor, border: categoria.cor === cor ? '3px solid #0d0d0d' : '3px solid transparent',
                          cursor: 'pointer', transition: 'border 0.15s',
                        }}
                      />
                    ))}
                  </div>
                </div>
                <button type="submit" disabled={carregando} style={{
                  background: '#0984e3', color: '#fff', border: 'none',
                  padding: '10px', borderRadius: '4px', fontSize: '13px',
                  fontWeight: 600, cursor: 'pointer', marginTop: '8px',
                  opacity: carregando ? 0.6 : 1,
                }}>
                  {carregando ? 'Criando...' : 'Criar categoria →'}
                </button>
              </form>
            </>
          )}

          {passo === 1 && (
            <>
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#0d0d0d', marginBottom: '8px' }}>
                Adicione sua primeira transação
              </h2>
              <p style={{ fontSize: '13px', color: '#888', marginBottom: '28px', lineHeight: 1.6 }}>
                Registre uma receita ou despesa para começar a ver seu fluxo de caixa.
              </p>
              {erro && (
                <div style={{ background: '#d6303120', color: '#d63031', fontSize: '13px', borderRadius: '4px', padding: '10px 14px', marginBottom: '16px' }}>
                  {erro}
                </div>
              )}
              <form onSubmit={criarTransacao} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#444', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Descrição</label>
                  <input type="text" required value={transacao.descricao}
                    onChange={e => setTransacao({ ...transacao, descricao: e.target.value })}
                    placeholder="Ex: Salário de março"
                    style={inputStyle} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#444', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Valor</label>
                    <input type="number" required min="0.01" step="0.01" value={transacao.valor}
                      onChange={e => setTransacao({ ...transacao, valor: e.target.value })}
                      placeholder="0,00" style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#444', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tipo</label>
                    <select value={transacao.tipo}
                      onChange={e => setTransacao({ ...transacao, tipo: e.target.value })}
                      style={{ ...inputStyle }}>
                      <option value="receita">Receita</option>
                      <option value="despesa">Despesa</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#444', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Data</label>
                  <input type="date" required value={transacao.data}
                    onChange={e => setTransacao({ ...transacao, data: e.target.value })}
                    style={inputStyle} />
                </div>
                <button type="submit" disabled={carregando} style={{
                  background: '#0984e3', color: '#fff', border: 'none',
                  padding: '10px', borderRadius: '4px', fontSize: '13px',
                  fontWeight: 600, cursor: 'pointer', marginTop: '8px',
                  opacity: carregando ? 0.6 : 1,
                }}>
                  {carregando ? 'Salvando...' : 'Adicionar transação →'}
                </button>
              </form>
            </>
          )}

          {passo === 2 && (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '50%',
                background: '#00b89420', display: 'flex', alignItems: 'center',
                justifyContent: 'center', margin: '0 auto 24px',
                fontSize: '28px',
              }}>✓</div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0d0d0d', marginBottom: '12px' }}>
                Tudo configurado!
              </h2>
              <p style={{ fontSize: '14px', color: '#888', lineHeight: 1.7, marginBottom: '32px' }}>
                Sua organização está pronta. Agora você pode acompanhar suas finanças no dashboard.
              </p>
              <button
                onClick={() => navigate('/dashboard')}
                style={{
                  background: '#0984e3', color: '#fff', border: 'none',
                  padding: '12px 32px', borderRadius: '4px', fontSize: '14px',
                  fontWeight: 600, cursor: 'pointer', width: '100%',
                }}
                onMouseEnter={e => e.target.style.background = '#0773c5'}
                onMouseLeave={e => e.target.style.background = '#0984e3'}
              >
                Ir para o dashboard →
              </button>
            </div>
          )}
        </div>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: '#aaa' }}>
          Etapa {passo + 1} de {PASSOS.length}
        </p>
      </div>
    </div>
  )
}
