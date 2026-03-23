import { useState, useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'
import api from '../services/api'
import { useAtualizacao } from '../contexts/AtualizacaoContext'

Chart.register(...registerables)

function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)
}

function CardMetrica({ titulo, valor, cor, icone, borda }) {
  return (
    <div style={{
      background: '#e8e8e2', borderRadius: '6px',
      borderLeft: `4px solid ${borda}`, padding: '24px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <span style={{ fontSize: '11px', fontWeight: 500, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {titulo}
        </span>
        <span style={{ width: '36px', height: '36px', borderRadius: '6px', background: borda + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
          {icone}
        </span>
      </div>
      <div style={{ fontSize: '28px', fontWeight: 600, color: cor, letterSpacing: '-0.02em' }}>
        {formatarMoeda(valor)}
      </div>
    </div>
  )
}

function GraficoBarras({ dados, titulo, corBarra, vazio }) {
  const canvasRef = useRef(null)
  const chartRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current) return
    if (chartRef.current) chartRef.current.destroy()

    if (dados.length === 0) return

    const ctx = canvasRef.current.getContext('2d')
    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: dados.map(c => c.categoria_nome),
        datasets: [{
          data: dados.map(c => c.total),
          backgroundColor: dados.map(c => (c.categoria_cor || corBarra) + 'CC'),
          borderColor: dados.map(c => c.categoria_cor || corBarra),
          borderWidth: 1,
          borderRadius: 4,
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: { label: (ctx) => formatarMoeda(ctx.raw) }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: { font: { size: 10, family: 'Inter' }, color: '#888', callback: (v) => formatarMoeda(v) }
          },
          y: {
            grid: { display: false },
            ticks: { font: { size: 11, family: 'Inter' }, color: '#444' }
          }
        }
      }
    })
    return () => { if (chartRef.current) chartRef.current.destroy() }
  }, [dados])

  const altura = Math.max(dados.length * 44, 80)

  return (
    <div style={{ background: '#e8e8e2', borderRadius: '6px', padding: '20px', boxShadow: '0 4px 16px rgba(0,0,0,0.10)', flex: 1 }}>
      <h3 style={{ fontSize: '12px', fontWeight: 600, color: '#444', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {titulo}
      </h3>
      {dados.length === 0 ? (
        <p style={{ fontSize: '13px', color: '#aaa', textAlign: 'center', padding: '24px 0' }}>{vazio}</p>
      ) : (
        <div style={{ height: `${altura}px` }}>
          <canvas ref={canvasRef} />
        </div>
      )}
    </div>
  )
}

function GraficoDiferenca({ receitas, despesas }) {
  const canvasRef = useRef(null)
  const chartRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current) return
    if (chartRef.current) chartRef.current.destroy()

    const todasCategorias = [...new Set([
      ...receitas.map(r => r.categoria_nome),
      ...despesas.map(d => d.categoria_nome),
    ])]

    if (todasCategorias.length === 0) return

    const totalReceitas = todasCategorias.map(nome => {
      const r = receitas.find(r => r.categoria_nome === nome)
      return r ? r.total : 0
    })

    const totalDespesas = todasCategorias.map(nome => {
      const d = despesas.find(d => d.categoria_nome === nome)
      return d ? d.total : 0
    })

    const ctx = canvasRef.current.getContext('2d')
    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: todasCategorias,
        datasets: [
          {
            label: 'Receitas',
            data: totalReceitas,
            backgroundColor: '#00b89480',
            borderColor: '#00b894',
            borderWidth: 1,
            borderRadius: 4,
          },
          {
            label: 'Despesas',
            data: totalDespesas,
            backgroundColor: '#d6303180',
            borderColor: '#d63031',
            borderWidth: 1,
            borderRadius: 4,
          }
        ]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: { font: { size: 11, family: 'Inter' }, color: '#444', boxWidth: 12 }
          },
          tooltip: {
            callbacks: { label: (ctx) => `${ctx.dataset.label}: ${formatarMoeda(ctx.raw)}` }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: { font: { size: 10, family: 'Inter' }, color: '#888', callback: (v) => formatarMoeda(v) }
          },
          y: {
            grid: { display: false },
            ticks: { font: { size: 11, family: 'Inter' }, color: '#444' }
          }
        }
      }
    })
    return () => { if (chartRef.current) chartRef.current.destroy() }
  }, [receitas, despesas])

  const todasCategorias = [...new Set([...receitas.map(r => r.categoria_nome), ...despesas.map(d => d.categoria_nome)])]
  const altura = Math.max(todasCategorias.length * 52, 100)

  return (
    <div style={{ background: '#e8e8e2', borderRadius: '6px', padding: '20px', boxShadow: '0 4px 16px rgba(0,0,0,0.10)' }}>
      <h3 style={{ fontSize: '12px', fontWeight: 600, color: '#444', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Receitas vs Despesas por categoria
      </h3>
      {todasCategorias.length === 0 ? (
        <p style={{ fontSize: '13px', color: '#aaa', textAlign: 'center', padding: '24px 0' }}>Nenhuma transação no período.</p>
      ) : (
        <div style={{ height: `${altura}px` }}>
          <canvas ref={canvasRef} />
        </div>
      )}
    </div>
  )
}

export default function Dashboard() {
  const hoje = new Date()
  const [mes, setMes] = useState(hoje.getMonth() + 1)
  const [ano, setAno] = useState(hoje.getFullYear())
  const [resumo, setResumo] = useState(null)
  const [despesas, setDespesas] = useState([])
  const [receitas, setReceitas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const { contador } = useAtualizacao()

  useEffect(() => {
    async function buscar() {
      setCarregando(true)
      const inicio = `${ano}-${String(mes).padStart(2, '0')}-01`
      const fim = new Date(ano, mes, 0).toISOString().split('T')[0]
      try {
        const [resResumo, resDespesas, resReceitas] = await Promise.all([
          api.get(`/api/relatorios/resumo/?data_inicio=${inicio}&data_fim=${fim}`),
          api.get(`/api/relatorios/por-categoria/?data_inicio=${inicio}&data_fim=${fim}`),
          api.get(`/api/relatorios/receitas-por-categoria/?data_inicio=${inicio}&data_fim=${fim}`),
        ])
        setResumo(resResumo.data)
        setDespesas(resDespesas.data)
        setReceitas(resReceitas.data)
      } catch (err) {
        console.error(err)
      } finally {
        setCarregando(false)
      }
    }
    buscar()
  }, [mes, ano, contador])

  const meses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#0d0d0d' }}>Dashboard</h2>
          <p style={{ fontSize: '13px', color: '#888', marginTop: '2px' }}>Visão geral financeira</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <select value={mes} onChange={(e) => setMes(Number(e.target.value))} style={{ border: '1px solid #d0d0ca', borderRadius: '4px', padding: '6px 12px', fontSize: '13px', color: '#444', background: '#e8e8e2', cursor: 'pointer' }}>
            {meses.map((nome, i) => <option key={i} value={i + 1}>{nome}</option>)}
          </select>
          <select value={ano} onChange={(e) => setAno(Number(e.target.value))} style={{ border: '1px solid #d0d0ca', borderRadius: '4px', padding: '6px 12px', fontSize: '13px', color: '#444', background: '#e8e8e2', cursor: 'pointer' }}>
            {[2024, 2025, 2026].map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
      </div>

      {carregando ? (
        <p style={{ fontSize: '13px', color: '#888' }}>Carregando...</p>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
            <CardMetrica titulo="Saldo atual" valor={resumo?.saldo || 0} cor="#0d0d0d" icone="◈" borda="#0984e3" />
            <CardMetrica titulo="Total receitas" valor={resumo?.total_receitas || 0} cor="#00b894" icone="↑" borda="#00b894" />
            <CardMetrica titulo="Total despesas" valor={resumo?.total_despesas || 0} cor="#d63031" icone="↓" borda="#d63031" />
          </div>

          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <GraficoBarras dados={receitas} titulo="Receitas por categoria" corBarra="#00b894" vazio="Nenhuma receita no período." />
            <GraficoBarras dados={despesas} titulo="Despesas por categoria" corBarra="#d63031" vazio="Nenhuma despesa no período." />
          </div>

          <GraficoDiferenca receitas={receitas} despesas={despesas} />
        </>
      )}
    </div>
  )
}
