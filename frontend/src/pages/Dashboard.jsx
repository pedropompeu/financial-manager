import { useState, useEffect } from 'react'
import api from '../services/api'

function CardMetrica({ titulo, valor, cor }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">{titulo}</p>
      <p className={`text-2xl font-semibold ${cor}`}>
        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)}
      </p>
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
          <p className="text-sm text-gray-400 mt-0.5">Visão geral financeira</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={mes}
            onChange={(e) => setMes(Number(e.target.value))}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {meses.map((nome, i) => (
              <option key={i} value={i + 1}>{nome}</option>
            ))}
          </select>
          <select
            value={ano}
            onChange={(e) => setAno(Number(e.target.value))}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {[2024, 2025, 2026].map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
      </div>

      {carregando ? (
        <p className="text-sm text-gray-400">Carregando...</p>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <CardMetrica titulo="Saldo atual" valor={resumo?.saldo || 0} cor="text-gray-800" />
            <CardMetrica titulo="Total receitas" valor={resumo?.total_receitas || 0} cor="text-green-600" />
            <CardMetrica titulo="Total despesas" valor={resumo?.total_despesas || 0} cor="text-red-500" />
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Despesas por categoria</h3>
            {categorias.length === 0 ? (
              <p className="text-sm text-gray-400">Nenhuma despesa no período.</p>
            ) : (
              <div className="space-y-3">
                {categorias.map((cat) => {
                  const total = categorias.reduce((acc, c) => acc + c.total, 0)
                  const pct = total > 0 ? (cat.total / total) * 100 : 0
                  return (
                    <div key={cat.categoria_id}>
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ background: cat.categoria_cor }}
                          />
                          <span className="text-sm text-gray-600">{cat.categoria_nome}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cat.total)}
                        </span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full">
                        <div
                          className="h-1.5 rounded-full"
                          style={{ width: `${pct}%`, background: cat.categoria_cor }}
                        />
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
