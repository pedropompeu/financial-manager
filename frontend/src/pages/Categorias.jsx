import { useState, useEffect } from 'react'
import api from '../services/api'

export default function Categorias() {
  const [categorias, setCategorias] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState({ nome: '', cor: '#6366f1' })
  const [erro, setErro] = useState('')

  useEffect(() => {
    buscar()
  }, [])

  async function buscar() {
    setCarregando(true)
    try {
      const res = await api.get('/api/categorias/')
      setCategorias(res.data.results || [])
    } finally {
      setCarregando(false)
    }
  }

  function abrirNovo() {
    setEditando(null)
    setForm({ nome: '', cor: '#6366f1' })
    setErro('')
    setMostrarForm(true)
  }

  function abrirEditar(cat) {
    setEditando(cat)
    setForm({ nome: cat.nome, cor: cat.cor })
    setErro('')
    setMostrarForm(true)
  }

  async function salvar(e) {
    e.preventDefault()
    setErro('')
    try {
      if (editando) {
        await api.put(`/api/categorias/${editando.id}/`, form)
      } else {
        await api.post('/api/categorias/', form)
      }
      setMostrarForm(false)
      buscar()
    } catch (err) {
      if (err.response?.data?.nome) {
        setErro(err.response.data.nome)
      } else {
        setErro('Erro ao salvar categoria.')
      }
    }
  }

  async function deletar(id) {
    if (!confirm('Deseja excluir esta categoria?')) return
    await api.delete(`/api/categorias/${id}/`)
    buscar()
  }

  return (
    <div>
      {mostrarForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl border border-gray-100 w-full max-w-sm p-6">
            <h3 className="text-base font-semibold text-gray-800 mb-5">
              {editando ? 'Editar categoria' : 'Nova categoria'}
            </h3>
            <form onSubmit={salvar} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input
                  type="text" required
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Ex: Alimentação, Transporte..."
                />
                {erro && <p className="text-red-500 text-xs mt-1">{erro}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cor</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={form.cor}
                    onChange={(e) => setForm({ ...form, cor: e.target.value })}
                    className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
                  />
                  <span className="text-sm text-gray-500">{form.cor}</span>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setMostrarForm(false)}
                  className="flex-1 border border-gray-200 text-gray-500 py-2 rounded-lg text-sm hover:bg-gray-50 transition">
                  Cancelar
                </button>
                <button type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm font-medium transition">
                  {editando ? 'Salvar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Categorias</h2>
          <p className="text-sm text-gray-400 mt-0.5">{categorias.length} categoria{categorias.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={abrirNovo}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
          + Nova categoria
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {carregando ? (
          <p className="text-sm text-gray-400 col-span-3">Carregando...</p>
        ) : categorias.length === 0 ? (
          <div className="col-span-3 bg-white rounded-xl border border-gray-100 p-8 text-center">
            <p className="text-gray-400 text-sm">Nenhuma categoria criada ainda.</p>
            <button onClick={abrirNovo}
              className="mt-3 text-indigo-600 text-sm hover:underline">
              Criar primeira categoria
            </button>
          </div>
        ) : categorias.map((cat) => (
          <div key={cat.id}
            className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between hover:border-gray-200 transition">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: cat.cor + '20' }}>
                <div className="w-3.5 h-3.5 rounded-full" style={{ background: cat.cor }} />
              </div>
              <span className="text-sm font-medium text-gray-700">{cat.nome}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => abrirEditar(cat)}
                className="text-xs text-indigo-500 hover:text-indigo-700">Editar</button>
              <button onClick={() => deletar(cat.id)}
                className="text-xs text-red-400 hover:text-red-600">Excluir</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
