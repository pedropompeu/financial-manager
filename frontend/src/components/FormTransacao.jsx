import { useState, useEffect } from 'react'
import api from '../services/api'

export default function FormTransacao({ transacao, onSalvo, onCancelar }) {
  const [categorias, setCategorias] = useState([])
  const [form, setForm] = useState({
    descricao: '',
    valor: '',
    tipo: 'receita',
    data: new Date().toISOString().split('T')[0],
    categoria: '',
  })
  const [erros, setErros] = useState({})
  const [carregando, setCarregando] = useState(false)

  useEffect(() => {
    api.get('/api/categorias/').then((res) => setCategorias(res.data.results || []))
  }, [])

  useEffect(() => {
    if (transacao) {
      setForm({
        descricao: transacao.descricao,
        valor: transacao.valor,
        tipo: transacao.tipo,
        data: transacao.data,
        categoria: transacao.categoria || '',
      })
    }
  }, [transacao])

  function atualizar(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function enviar(e) {
    e.preventDefault()
    setErros({})
    setCarregando(true)
    try {
      const payload = { ...form, categoria: form.categoria || null }
      if (transacao) {
        await api.put(`/api/transacoes/${transacao.id}/`, payload)
      } else {
        await api.post('/api/transacoes/', payload)
      }
      onSalvo()
    } catch (err) {
      if (err.response?.data) setErros(err.response.data)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl border border-gray-100 w-full max-w-md p-6">
        <h3 className="text-base font-semibold text-gray-800 mb-5">
          {transacao ? 'Editar transação' : 'Nova transação'}
        </h3>
        <form onSubmit={enviar} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <input type="text" name="descricao" value={form.descricao} onChange={atualizar} required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ex: Salário, Aluguel..." />
            {erros.descricao && <p className="text-red-500 text-xs mt-1">{erros.descricao}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valor</label>
              <input type="number" name="valor" value={form.valor} onChange={atualizar}
                required min="0.01" step="0.01"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="0,00" />
              {erros.valor && <p className="text-red-500 text-xs mt-1">{erros.valor}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <select name="tipo" value={form.tipo} onChange={atualizar}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="receita">Receita</option>
                <option value="despesa">Despesa</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
              <input type="date" name="data" value={form.data} onChange={atualizar} required
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
              <select name="categoria" value={form.categoria} onChange={atualizar}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Sem categoria</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>{c.nome}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onCancelar}
              className="flex-1 border border-gray-200 text-gray-500 py-2 rounded-lg text-sm hover:bg-gray-50 transition">
              Cancelar
            </button>
            <button type="submit" disabled={carregando}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm font-medium transition disabled:opacity-50">
              {carregando ? 'Salvando...' : transacao ? 'Salvar' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
