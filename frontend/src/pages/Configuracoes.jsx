import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import { botaoPrimario, botaoSecundario, input } from '../components/ui/styles'

export default function Configuracoes() {
  const { usuario } = useAuth()
  const [aba, setAba] = useState('perfil')
  const [perfil, setPerfil] = useState({ nome: usuario?.nome || '' })
  const [senha, setSenha] = useState({ senha_atual: '', nova_senha: '', confirmar_senha: '' })
  const [sucesso, setSucesso] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function salvarPerfil(e) {
    e.preventDefault()
    setErro('')
    setSucesso('')
    setCarregando(true)
    try {
      await api.patch('/api/auth/perfil/', { nome: perfil.nome })
      setSucesso('Perfil atualizado com sucesso!')
    } catch {
      setErro('Erro ao atualizar perfil.')
    } finally {
      setCarregando(false)
    }
  }

  async function salvarSenha(e) {
    e.preventDefault()
    setErro('')
    setSucesso('')
    if (senha.nova_senha !== senha.confirmar_senha) {
      setErro('As senhas não coincidem.')
      return
    }
    if (senha.nova_senha.length < 8) {
      setErro('A nova senha deve ter pelo menos 8 caracteres.')
      return
    }
    setCarregando(true)
    try {
      await api.post('/api/auth/alterar-senha/', {
        senha_atual: senha.senha_atual,
        nova_senha: senha.nova_senha,
      })
      setSucesso('Senha alterada com sucesso!')
      setSenha({ senha_atual: '', nova_senha: '', confirmar_senha: '' })
    } catch (err) {
      setErro(err.response?.data?.detail || 'Erro ao alterar senha.')
    } finally {
      setCarregando(false)
    }
  }

  const abas = [
    { id: 'perfil', label: 'Perfil' },
    { id: 'senha', label: 'Segurança' },
    { id: 'organizacao', label: 'Organização' },
  ]

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#0d0d0d' }}>Configurações</h2>
        <p style={{ fontSize: '13px', color: '#888', marginTop: '2px' }}>Gerencie sua conta e preferências</p>
      </div>

      <div style={{ display: 'flex', gap: '24px' }}>
        <div style={{ width: '180px', flexShrink: 0 }}>
          {abas.map(({ id, label }) => (
            <button key={id} onClick={() => { setAba(id); setErro(''); setSucesso('') }}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '9px 12px', borderRadius: '4px', border: 'none',
                fontSize: '13px', cursor: 'pointer', marginBottom: '2px',
                fontWeight: aba === id ? 500 : 400,
                background: aba === id ? '#0984e320' : 'transparent',
                color: aba === id ? '#0984e3' : '#636e72',
                borderLeft: aba === id ? '2px solid #0984e3' : '2px solid transparent',
                transition: 'all 0.15s',
              }}>
              {label}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, maxWidth: '480px' }}>
          {sucesso && (
            <div style={{ background: '#00b89420', border: '1px solid #00b89440', color: '#00b894', fontSize: '13px', borderRadius: '4px', padding: '10px 14px', marginBottom: '20px' }}>
              {sucesso}
            </div>
          )}
          {erro && (
            <div style={{ background: '#d6303120', border: '1px solid #d6303140', color: '#d63031', fontSize: '13px', borderRadius: '4px', padding: '10px 14px', marginBottom: '20px' }}>
              {erro}
            </div>
          )}

          {aba === 'perfil' && (
            <div style={{ background: '#e8e8e2', borderRadius: '6px', padding: '28px', boxShadow: '0 4px 16px rgba(0,0,0,0.10)' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d', marginBottom: '24px' }}>Informações do perfil</h3>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
                <div style={{
                  width: '56px', height: '56px', borderRadius: '50%',
                  background: '#0984e320', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '22px', fontWeight: 700, color: '#0984e3',
                }}>
                  {usuario?.nome?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 500, color: '#0d0d0d' }}>{usuario?.nome}</p>
                  <p style={{ fontSize: '12px', color: '#888' }}>{usuario?.email}</p>
                  <p style={{ fontSize: '11px', color: '#0984e3', marginTop: '2px', textTransform: 'capitalize' }}>
                    {usuario?.perfil === 'admin' ? 'Administrador' : 'Colaborador'}
                  </p>
                </div>
              </div>

              <form onSubmit={salvarPerfil} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#444', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Nome completo
                  </label>
                  <input type="text" value={perfil.nome}
                    onChange={e => setPerfil({ ...perfil, nome: e.target.value })}
                    style={input}
                    onFocus={e => e.target.style.borderColor = '#0984e3'}
                    onBlur={e => e.target.style.borderColor = '#d0d0ca'}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#444', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    E-mail
                  </label>
                  <input type="email" value={usuario?.email || ''} disabled
                    style={{ ...input, opacity: 0.5, cursor: 'not-allowed' }} />
                  <p style={{ fontSize: '11px', color: '#aaa', marginTop: '4px' }}>O e-mail não pode ser alterado.</p>
                </div>
                <button type="submit" disabled={carregando}
                  style={{ ...botaoPrimario, opacity: carregando ? 0.6 : 1 }}
                  onMouseEnter={e => e.target.style.background = '#0773c5'}
                  onMouseLeave={e => e.target.style.background = '#0984e3'}>
                  {carregando ? 'Salvando...' : 'Salvar alterações'}
                </button>
              </form>
            </div>
          )}

          {aba === 'senha' && (
            <div style={{ background: '#e8e8e2', borderRadius: '6px', padding: '28px', boxShadow: '0 4px 16px rgba(0,0,0,0.10)' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d', marginBottom: '24px' }}>Alterar senha</h3>
              <form onSubmit={salvarSenha} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { label: 'Senha atual', name: 'senha_atual', value: senha.senha_atual },
                  { label: 'Nova senha', name: 'nova_senha', value: senha.nova_senha },
                  { label: 'Confirmar nova senha', name: 'confirmar_senha', value: senha.confirmar_senha },
                ].map(({ label, name, value }) => (
                  <div key={name}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#444', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {label}
                    </label>
                    <input type="password" value={value} required
                      onChange={e => setSenha({ ...senha, [name]: e.target.value })}
                      style={input}
                      onFocus={e => e.target.style.borderColor = '#0984e3'}
                      onBlur={e => e.target.style.borderColor = '#d0d0ca'}
                    />
                  </div>
                ))}
                <button type="submit" disabled={carregando}
                  style={{ ...botaoPrimario, opacity: carregando ? 0.6 : 1 }}
                  onMouseEnter={e => e.target.style.background = '#0773c5'}
                  onMouseLeave={e => e.target.style.background = '#0984e3'}>
                  {carregando ? 'Alterando...' : 'Alterar senha'}
                </button>
              </form>
            </div>
          )}

          {aba === 'organizacao' && (
            <div style={{ background: '#e8e8e2', borderRadius: '6px', padding: '28px', boxShadow: '0 4px 16px rgba(0,0,0,0.10)' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d', marginBottom: '24px' }}>Dados da organização</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { label: 'Nome da organização', value: usuario?.organizacao_nome },
                  { label: 'Seu perfil', value: usuario?.perfil === 'admin' ? 'Administrador' : 'Colaborador' },
                  { label: 'E-mail de acesso', value: usuario?.email },
                ].map(({ label, value }) => (
                  <div key={label} style={{ borderBottom: '1px solid #d0d0ca', paddingBottom: '16px' }}>
                    <p style={{ fontSize: '11px', fontWeight: 500, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{label}</p>
                    <p style={{ fontSize: '14px', color: '#0d0d0d', fontWeight: 500 }}>{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
