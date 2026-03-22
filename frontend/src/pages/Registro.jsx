import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Registro() {
  const { registro } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    nome_organizacao: '',
    nome_usuario: '',
    email: '',
    senha: '',
  })
  const [erros, setErros] = useState({})
  const [carregando, setCarregando] = useState(false)

  function atualizar(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function enviar(e) {
    e.preventDefault()
    setErros({})
    setCarregando(true)
    try {
      await registro(form)
      navigate('/login?registrado=1')
    } catch (err) {
      if (err.response?.data) {
        setErros(err.response.data)
      } else {
        setErros({ geral: 'Erro ao criar organização. Tente novamente.' })
      }
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-md p-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-1">Criar organização</h1>
        <p className="text-sm text-gray-500 mb-6">Configure sua conta no FinancialManager</p>

        {erros.geral && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
            {erros.geral}
          </div>
        )}

        <form onSubmit={enviar} className="space-y-4">
          {[
            { label: 'Nome da organização', name: 'nome_organizacao', type: 'text', placeholder: 'Minha Empresa' },
            { label: 'Seu nome', name: 'nome_usuario', type: 'text', placeholder: 'João Silva' },
            { label: 'E-mail', name: 'email', type: 'email', placeholder: 'joao@empresa.com' },
            { label: 'Senha', name: 'senha', type: 'password', placeholder: '••••••••' },
          ].map(({ label, name, type, placeholder }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                type={type}
                name={name}
                value={form[name]}
                onChange={atualizar}
                required
                placeholder={placeholder}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {erros[name] && (
                <p className="text-red-500 text-xs mt-1">{erros[name]}</p>
              )}
            </div>
          ))}
          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg text-sm transition disabled:opacity-50"
          >
            {carregando ? 'Criando...' : 'Criar organização'}
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-6">
          Já tem conta?{' '}
          <Link to="/login" className="text-indigo-600 hover:underline font-medium">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}
