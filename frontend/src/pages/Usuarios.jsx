import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import { botaoPrimario, input } from '../components/ui/styles'

const PERFIS = { admin: 'Administrador', colaborador: 'Colaborador' }

export default function Usuarios() {
  const { usuario } = useAuth()
  const [usuarios, setUsuarios] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [form, setForm] = useState({ nome: '', email: '', perfil: 'colaborador', senha: '' })
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [salvando, setSalvando] = useState(false)

  const ehAdmin = usuario?.perfil === 'admin'

  useEffect(() => { buscar() }, [])

  async function buscar() {
    setCarregando(true)
    try {
      const res = await api.get('/api/auth/usuarios/')
      setUsuarios(res.data.results || res.data)
    } finally {
      setCarregando(false)
    }
  }

  async function criarUsuario(e) {
    e.preventDefault()
    setErro('')
    setSucesso('')
    setSalvando(true)
    try {
      await api.post('/api/auth/usuarios/criar/', form)
      setSucesso('Usuário criado com sucesso!')
      setMostrarForm(false)
      setForm({ nome: '', email: '', perfil: 'colaborador', senha: '' })
      buscar()
    } catch (err) {
      const erros = err.response?.data
      if (erros?.email) setErro(erros.email)
      else if (erros?.detail) setErro(erros.detail)
      else setErro('Erro ao criar usuário.')
    } finally {
      setSalvando(false)
    }
  }

  async function alterarPerfil(id, perfil) {
    try {
      await api.patch(`/api/auth/usuarios/${id}/`, { perfil })
      buscar()
    } catch {
      setErro('Erro ao alterar perfil.')
    }
  }

  async function removerUsuario(id) {
    if (!confirm('Deseja remover este usuário da organização?')) return
    try {
      await api.delete(`/api/auth/usuarios/${id}/`)
      buscar()
    } catch (err) {
      setErro(err.response?.data?.detail || 'Erro ao remover usuário.')
    }
  }

  return (
    <div>
      {mostrarForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '24px' }}>
          <div style={{ background: '#e8e8e2', borderRadius: '6px', width: '100%', maxWidth: '420px', padding: '28px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#0d0d0d', marginBottom: '24px' }}>Novo usuário</h3>
            {erro && (
              <div style={{ background: '#d6303120', color: '#d63031', fontSize: '13px', borderRadius: '4px', padding: '10px 14px', marginBottom: '16px' }}>
                {erro}
              </div>
            )}
            <form onSubmit={criarUsuario} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { label: 'Nome completo', name: 'nome', type: 'text', placeholder: 'João Silva' },
                { label: 'E-mail', name: 'email', type: 'email', placeholder: 'joao@empresa.com' },
                { label: 'Senha inicial', name: 'senha', type: 'password', placeholder: '••••••••' },
              ].map(({ label, name, type, placeholder }) => (
                <div key={name}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#444', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {label}
                  </label>
                  <input type={type} required value={form[name]} placeholder={placeholder}
                    onChange={e => setForm({ ...form, [name]: e.target.value })}
                    style={input}
                    onFocus={e => e.target.style.borderColor = '#0984e3'}
                    onBlur={e => e.target.style.borderColor = '#d0d0ca'}
                  />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#444', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Perfil de acesso
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {[
                    { value: 'colaborador', label: 'Colaborador', desc: 'Gerencia transações' },
                    { value: 'admin', label: 'Administrador', desc: 'Acesso total' },
                  ].map(({ value, label, desc }) => (
                    <button key={value} type="button"
                      onClick={() => setForm({ ...form, perfil: value })}
                      style={{
                        flex: 1, padding: '12px', borderRadius: '4px', cursor: 'pointer',
                        border: form.perfil === value ? '2px solid #0984e3' : '2px solid #d0d0ca',
                        background: form.perfil === value ? '#0984e310' : 'transparent',
                        textAlign: 'left', transition: 'all 0.15s',
                      }}>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: '#0d0d0d', marginBottom: '2px' }}>{label}</p>
                      <p style={{ fontSize: '11px', color: '#888' }}>{desc}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button type="button" onClick={() => { setMostrarForm(false); setErro('') }}
                  style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #d0d0ca', background: 'transparent', fontSize: '13px', cursor: 'pointer', color: '#444' }}>
                  Cancelar
                </button>
                <button type="submit" disabled={salvando}
                  style={{ ...botaoPrimario, flex: 1, padding: '10px', opacity: salvando ? 0.6 : 1 }}>
                  {salvando ? 'Criando...' : 'Criar usuário'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#0d0d0d' }}>Usuários</h2>
          <p style={{ fontSize: '13px', color: '#888', marginTop: '2px' }}>
            {usuarios.length} membro{usuarios.length !== 1 ? 's' : ''} na organização
          </p>
        </div>
        {ehAdmin && (
          <button onClick={() => { setMostrarForm(true); setErro(''); setSucesso('') }}
            style={botaoPrimario}
            onMouseEnter={e => e.target.style.background = '#0773c5'}
            onMouseLeave={e => e.target.style.background = '#0984e3'}>
            + Novo usuário
          </button>
        )}
      </div>

      {sucesso && (
        <div style={{ background: '#00b89420', border: '1px solid #00b89440', color: '#00b894', fontSize: '13px', borderRadius: '4px', padding: '10px 14px', marginBottom: '16px' }}>
          {sucesso}
        </div>
      )}

      {!ehAdmin && (
        <div style={{ background: '#f39c1220', border: '1px solid #f39c1240', color: '#856404', fontSize: '13px', borderRadius: '4px', padding: '10px 14px', marginBottom: '16px' }}>
          Apenas administradores podem gerenciar usuários.
        </div>
      )}

      <div style={{ background: '#e8e8e2', borderRadius: '6px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.10)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#d8d8d2', borderBottom: '1px solid #c8c8c2' }}>
              {['Usuário', 'Perfil', 'Permissões', 'Membro desde', ...(ehAdmin ? [''] : [])].map((col, i) => (
                <th key={i} style={{ padding: '10px 16px', fontSize: '11px', fontWeight: 500, color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'left' }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {carregando ? (
              <tr><td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: '#888', fontSize: '13px' }}>Carregando...</td></tr>
            ) : usuarios.map((u) => (
              <tr key={u.id}
                onMouseEnter={e => e.currentTarget.style.background = '#d8d8d2'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                style={{ transition: 'background 0.1s', borderBottom: '1px solid #d0d0ca' }}>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '34px', height: '34px', borderRadius: '50%',
                      background: '#0984e320', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: '13px', fontWeight: 600, color: '#0984e3', flexShrink: 0,
                    }}>
                      {u.nome.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: 500, color: '#0d0d0d' }}>
                        {u.nome}
                        {u.id === usuario?.id && (
                          <span style={{ fontSize: '10px', background: '#d0d0ca', color: '#666', padding: '1px 6px', borderRadius: '4px', marginLeft: '6px' }}>você</span>
                        )}
                      </p>
                      <p style={{ fontSize: '12px', color: '#888' }}>{u.email}</p>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  {ehAdmin && u.id !== usuario?.id ? (
                    <select value={u.perfil}
                      onChange={e => alterarPerfil(u.id, e.target.value)}
                      style={{
                        border: '1px solid #d0d0ca', borderRadius: '4px',
                        padding: '4px 8px', fontSize: '12px', background: '#f0f0eb',
                        color: '#0d0d0d', cursor: 'pointer',
                      }}>
                      <option value="colaborador">Colaborador</option>
                      <option value="admin">Administrador</option>
                    </select>
                  ) : (
                    <span style={{
                      display: 'inline-block', padding: '3px 10px', borderRadius: '4px',
                      fontSize: '11px', fontWeight: 500,
                      background: u.perfil === 'admin' ? '#0984e320' : '#d0d0ca',
                      color: u.perfil === 'admin' ? '#0984e3' : '#636e72',
                    }}>
                      {PERFIS[u.perfil]}
                    </span>
                  )}
                </td>
                <td style={{ padding: '14px 16px', fontSize: '12px', color: '#636e72' }}>
                  {u.perfil === 'admin'
                    ? 'Acesso total — usuários, transações e categorias'
                    : 'Transações e categorias apenas'}
                </td>
                <td style={{ padding: '14px 16px', fontSize: '12px', color: '#888' }}>
                  {new Date(u.criado_em).toLocaleDateString('pt-BR')}
                </td>
                {ehAdmin && (
                  <td style={{ padding: '14px 16px' }}>
                    {u.id !== usuario?.id && (
                      <button onClick={() => removerUsuario(u.id)}
                        style={{ background: 'transparent', border: 'none', color: '#d63031', fontSize: '12px', cursor: 'pointer', padding: '4px 8px', borderRadius: '4px' }}
                        onMouseEnter={e => e.target.style.background = '#d6303115'}
                        onMouseLeave={e => e.target.style.background = 'transparent'}>
                        Remover
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
