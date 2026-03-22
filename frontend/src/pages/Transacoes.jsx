import { useState, useEffect } from 'react'
import api from '../services/api'
import FormTransacao from '../components/FormTransacao'

const TIPOS = { receita: 'Receita', despesa: 'Despesa' }

function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)
}

function formatarData(data) {
  return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR')
}

export default function Transacoes() {
  const [transacoes, setTransacoes] = useState([])
  const [categorias, setCategorias] = useState([])
  const [total, setTotal] = useState(0)
  const [pagina, setPagina] = useState(1)
  const [carregando, setCarregando] = useState(true)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [transacaoEditando, setTransacaoEditando] = useState(null)
  const [filtros, setFiltros] = useState({
    tipo: '', categoria: '', data_inicio: '', data_fim: ''
  })

  useEffect(() => {
    api.get('/api/categorias/').then((res) => setCategorias(res.data.results || []))
  }, [])

  useEffect(() => {
    buscar(1)
  }, [filtros])

  async function buscar(pag) {
    setCarregando(true)
    const params = new URLSearchParams({ page: pag })
    if (filtros.tipo) params.append('tipo', filtros.tipo)
    if (filtros.categoria) params.append('categoria', filtros.categoria)
    if (filtros.data_inicio) params.append('data_inicio', filtros.data_inicio)
    if (filtros.data_fim) params.append('data_fim', filtros.data_fim)
    try {
      const res = await api.get(`/api/transacoes/?${params}`)
      setTransacoes(res.data.results)
      setTotal(res.data.count)
      setPagina(pag)
    } finally {
      setCarregando(false)
    }
  }

  async function deletar(id) {
    if (!confirm('Deseja excluir esta transação?')) return
    await api.delete(`/api/transacoes/${id}/`)
    buscar(pagina)
  }

  function atualizarFiltro(e) {
    setFiltros({ ...filtros, [e.target.name]: e.target.value })
  }

  function aoSalvar() {
    setMostrarForm(false)
    setTransacaoEditando(null)
    buscar(1)
  }

  const totalPaginas = Math.ceil(total / 20)

  return (
    <div>
      {(mostrarForm || transacaoEditando) && (
        <FormTransacao
          transacao={transacaoEditando}
          onSalvo={aoSalvar}
          onCancelar={() => { setMostrarForm(false); setTransacaoEditando(null) }}
        />
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Transações</h2>
          <p className="text-sm text-gray-400 mt-0.5">{total} registro{total !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setMostrarForm(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
          + Nova transação
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4 grid grid-cols-4 gap-3">
        <select name="tipo" value={filtros.tipo} onChange={atualizarFiltro}
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="">Todos os tipos</option>
          <option value="receita">Receita</option>
          <option value="despesa">Despesa</option>
        </select>
        <select name="categoria" value={filtros.categoria} onChange={atualizarFiltro}
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="">Todas as categorias</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>{c.nome}</option>
          ))}
        </select>
        <input type="date" name="data_inicio" value={filtros.data_inicio} onChange={atualizarFiltro}
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        <input type="date" name="data_fim" value={filtros.data_fim} onChange={atualizarFiltro}
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {['Data', 'Descrição', 'Categoria', 'Tipo', 'Valor', ''].map((col, i) => (
                <th key={i} className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {carregando ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400 text-sm">Carregando...</td></tr>
            ) : transacoes.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400 text-sm">Nenhuma transação encontrada.</td></tr>
            ) : transacoes.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3 text-gray-500">{formatarData(t.data)}</td>
                <td className="px-4 py-3 text-gray-700 font-medium">{t.descricao}</td>
                <td className="px-4 py-3">
                  {t.categoria_nome ? (
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ background: t.categoria_cor }} />
                      <span className="text-gray-500">{t.categoria_nome}</span>
                    </span>
                  ) : <span className="text-gray-300">—</span>}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                    t.tipo === 'receita' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
                  }`}>{TIPOS[t.tipo]}</span>
                </td>
                <td className={`px-4 py-3 font-semibold ${
                  t.tipo === 'receita' ? 'text-green-600' : 'text-red-500'
                }`}>
                  {t.tipo === 'despesa' ? '- ' : '+ '}{formatarMoeda(t.valor)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => setTransacaoEditando(t)}
                      className="text-xs text-indigo-500 hover:text-indigo-700">Editar</button>
                    <button onClick={() => deletar(t.id)}
                      className="text-xs text-red-400 hover:text-red-600">Excluir</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {totalPaginas > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-400">Página {pagina} de {totalPaginas}</p>
            <div className="flex gap-2">
              <button onClick={() => buscar(pagina - 1)} disabled={pagina === 1}
                className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg text-gray-500 disabled:opacity-40 hover:bg-gray-50">
                Anterior
              </button>
              <button onClick={() => buscar(pagina + 1)} disabled={pagina === totalPaginas}
                className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg text-gray-500 disabled:opacity-40 hover:bg-gray-50">
                Próximo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
