import { useState, useEffect } from 'react'
import api from '../services/api'
import FormTransacao from '../components/FormTransacao'
import { botaoPrimario, botaoPerigo, botaoLink, select, card, tabelaHeader, tabelaHeaderCell, tabelaCell } from '../components/ui/styles'

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
  const [filtros, setFiltros] = useState({ tipo: '', categoria: '', data_inicio: '', data_fim: '' })

  useEffect(() => {
    api.get('/api/categorias/').then((res) => setCategorias(res.data.results || []))
  }, [])

  useEffect(() => { buscar(1) }, [filtros])

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
    } finally { setCarregando(false) }
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

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#0d0d0d' }}>Transações</h2>
          <p style={{ fontSize: '13px', color: '#888', marginTop: '2px' }}>{total} registro{total !== 1 ? 's' : ''}</p>
        </div>
        <button
          style={botaoPrimario}
          onMouseEnter={e => e.target.style.background = '#0773c5'}
          onMouseLeave={e => e.target.style.background = '#0984e3'}
          onClick={() => setMostrarForm(true)}
        >
          + Nova transação
        </button>
      </div>

      <div style={{ ...card, padding: '16px', marginBottom: '16px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        {[
          { name: 'tipo', options: [{ value: '', label: 'Todos os tipos' }, { value: 'receita', label: 'Receita' }, { value: 'despesa', label: 'Despesa' }] },
        ].map(({ name, options }) => (
          <select key={name} name={name} value={filtros[name]} onChange={atualizarFiltro} style={{ ...select, width: '100%' }}>
            {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        ))}
        <select name="categoria" value={filtros.categoria} onChange={atualizarFiltro} style={{ ...select, width: '100%' }}>
          <option value="">Todas as categorias</option>
          {categorias.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
        </select>
        <input type="date" name="data_inicio" value={filtros.data_inicio} onChange={atualizarFiltro}
          style={{ ...select, width: '100%' }} />
        <input type="date" name="data_fim" value={filtros.data_fim} onChange={atualizarFiltro}
          style={{ ...select, width: '100%' }} />
      </div>

      <div style={{ ...card, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={tabelaHeader}>
              {['Data', 'Descrição', 'Categoria', 'Tipo', 'Valor', ''].map((col, i) => (
                <th key={i} style={tabelaHeaderCell}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {carregando ? (
              <tr><td colSpan={6} style={{ ...tabelaCell, textAlign: 'center', color: '#888' }}>Carregando...</td></tr>
            ) : transacoes.length === 0 ? (
              <tr><td colSpan={6} style={{ ...tabelaCell, textAlign: 'center', color: '#888' }}>Nenhuma transação encontrada.</td></tr>
            ) : transacoes.map((t) => (
              <tr key={t.id} style={{ transition: 'background 0.1s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#d8d8d2'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td style={tabelaCell}>{formatarData(t.data)}</td>
                <td style={{ ...tabelaCell, fontWeight: 500, color: '#0d0d0d' }}>{t.descricao}</td>
                <td style={tabelaCell}>
                  {t.categoria_nome ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: t.categoria_cor }} />
                      {t.categoria_nome}
                    </span>
                  ) : <span style={{ color: '#ccc' }}>—</span>}
                </td>
                <td style={tabelaCell}>
                  <span style={{
                    display: 'inline-block', padding: '2px 8px', borderRadius: '4px',
                    fontSize: '11px', fontWeight: 500,
                    background: t.tipo === 'receita' ? '#00b89420' : '#d6303120',
                    color: t.tipo === 'receita' ? '#00b894' : '#d63031',
                  }}>
                    {TIPOS[t.tipo]}
                  </span>
                </td>
                <td style={{ ...tabelaCell, fontWeight: 600, color: t.tipo === 'receita' ? '#00b894' : '#d63031' }}>
                  {t.tipo === 'despesa' ? '- ' : '+ '}{formatarMoeda(t.valor)}
                </td>
                <td style={tabelaCell}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button style={botaoLink} onClick={() => setTransacaoEditando(t)}>Editar</button>
                    <button style={botaoPerigo} onClick={() => deletar(t.id)}>Excluir</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {totalPaginas > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderTop: '1px solid #d0d0ca' }}>
            <span style={{ fontSize: '12px', color: '#888' }}>Página {pagina} de {totalPaginas}</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => buscar(pagina - 1)} disabled={pagina === 1}
                style={{ ...select, opacity: pagina === 1 ? 0.4 : 1, cursor: pagina === 1 ? 'not-allowed' : 'pointer' }}>
                Anterior
              </button>
              <button onClick={() => buscar(pagina + 1)} disabled={pagina === totalPaginas}
                style={{ ...select, opacity: pagina === totalPaginas ? 0.4 : 1, cursor: pagina === totalPaginas ? 'not-allowed' : 'pointer' }}>
                Próximo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
