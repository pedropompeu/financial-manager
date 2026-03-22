import { useState, useEffect } from 'react'
import api from '../services/api'

function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)
}

function CardMetrica({ titulo, valor, cor, icone, borda }) {
  return (
    <div style={{
      background: '#e8e8e2',
      borderRadius: '6px',
      border: 'none',
      borderLeft: `4px solid ${borda}`,
      padding: '24px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <span style={{ fontSize: '11px', fontWeight: 500, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {titulo}
        </span>
        <span style={{
          width: '36px', height: '36px', borderRadius: '6px',
          background: borda + '20',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '18px',
        }}>
          {icone}
        </span>
      </div>
      <div style={{ fontSize: '28px', fontWeight: 600, color: cor, letterSpacing: '-0.02em' }}>
        {formatarMoeda(valor)}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const hoje = new Date()
  const [mes, setMes] = useState(hoje.getMonth() + 1)
  const [ano, setAno] = useState(hoje.getFullYear())
  const [resumo, setResumo] = useState(null)
  const [categorias, setCategorias] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    async function buscar() {
      setCarregando(true)
      const inicio = `${ano}-${String(mes).padStart(2, '0')}-01`
      const fim = new Date(ano, mes, 0).toISOString().split('T')[0]
      try {
        const [resResumo, resCategorias] = await Promise.all([
          api.get(`/api/relatorios/resumo/?data_inicio=${inicio}&data_fim=${fim}`),
          api.get(`/api/relatorios/por-categoria/?data_inicio=${inicio}&data_fim=${fim}`),
        ])
        setResumo(resResumo.data)
        setCategorias(resCategorias.data)
      } catch (err) {
        console.error(err)
      } finally {
        setCarregando(false)
      }
    }
    buscar()
  }, [mes, ano])

  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#0d0d0d' }}>Dashboard</h2>
          <p style={{ fontSize: '13px', color: '#888', marginTop: '2px' }}>Visão geral financeira</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <select value={mes} onChange={(e) => setMes(Number(e.target.value))} style={{
            border: '1px solid #d0d0ca', borderRadius: '4px', padding: '6px 12px',
            fontSize: '13px', color: '#444', background: '#e8e8e2', cursor: 'pointer',
          }}>
            {meses.map((nome, i) => (
              <option key={i} value={i + 1}>{nome}</option>
            ))}
          </select>
          <select value={ano} onChange={(e) => setAno(Number(e.target.value))} style={{
            border: '1px solid #d0d0ca', borderRadius: '4px', padding: '6px 12px',
            fontSize: '13px', color: '#444', background: '#e8e8e2', cursor: 'pointer',
          }}>
            {[2024, 2025, 2026].map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
      </div>

      {carregando ? (
        <p style={{ fontSize: '13px', color: '#888' }}>Carregando...</p>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
            <CardMetrica
              titulo="Saldo atual"
              valor={resumo?.saldo || 0}
              cor="#0d0d0d"
              icone="◈"
              borda="#0984e3"
            />
            <CardMetrica
              titulo="Total receitas"
              valor={resumo?.total_receitas || 0}
              cor="#00b894"
              icone="↑"
              borda="#00b894"
            />
            <CardMetrica
              titulo="Total despesas"
              valor={resumo?.total_despesas || 0}
              cor="#d63031"
              icone="↓"
              borda="#d63031"
            />
          </div>

          <div style={{
            background: '#e8e8e2', borderRadius: '6px', border: 'none',
            padding: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
          }}>
            <h3 style={{ fontSize: '13px', fontWeight: 500, color: '#444', marginBottom: '20px' }}>
              Despesas por categoria
            </h3>
            {categorias.length === 0 ? (
              <p style={{ fontSize: '13px', color: '#888' }}>Nenhuma despesa no período.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {categorias.map((cat) => {
                  const total = categorias.reduce((acc, c) => acc + c.total, 0)
                  const pct = total > 0 ? (cat.total / total) * 100 : 0
                  return (
                    <div key={cat.categoria_id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: cat.categoria_cor, flexShrink: 0 }} />
                          <span style={{ fontSize: '13px', color: '#444' }}>{cat.categoria_nome}</span>
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: 500, color: '#0d0d0d' }}>
                          {formatarMoeda(cat.total)}
                        </span>
                      </div>
                      <div style={{ height: '4px', background: '#d0d0ca', borderRadius: '2px' }}>
                        <div style={{ height: '4px', borderRadius: '2px', width: `${pct}%`, background: cat.categoria_cor, transition: 'width 0.4s ease' }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
