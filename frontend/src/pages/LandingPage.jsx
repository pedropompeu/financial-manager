import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useBreakpoint } from '../hooks/useBreakpoint'

const COR_PRIMARIA = '#0984e3'
const COR_SECUNDARIA = '#1a1a2e'
const COR_SUCESSO = '#00b894'
const COR_TEXTO = '#0d0d0d'
const COR_TEXTO_SUAVE = '#636e72'
const COR_FUNDO = '#f0f0eb'
const COR_CARD = '#e8e8e2'

export default function LandingPage() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: COR_FUNDO, color: COR_TEXTO }}>
      <Navbar />
      <Hero />
      <Funcionalidades />
      <ComoFunciona />
      <Precos />
      <Rodape />
    </div>
  )
}

function Navbar() {
  const { isMobile } = useBreakpoint()
  const [menuAberto, setMenuAberto] = useState(false)

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: COR_SECUNDARIA,
      padding: isMobile ? '0 20px' : '0 64px',
      height: '60px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '30px', height: '30px', background: COR_PRIMARIA,
          borderRadius: '4px', display: 'flex', alignItems: 'center',
          justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '15px',
        }}>F</div>
        <span style={{ color: '#fff', fontWeight: 600, fontSize: '15px' }}>FinancialManager</span>
      </div>

      {!isMobile && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          {['Funcionalidades', 'Como funciona', 'Preços'].map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} style={{
              color: 'rgba(255,255,255,0.55)', fontSize: '13px',
              textDecoration: 'none', transition: 'color 0.15s',
            }}
              onMouseEnter={e => e.target.style.color = '#fff'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.55)'}
            >{item}</a>
          ))}
        </div>
      )}

      {!isMobile ? (
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link to="/login" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', textDecoration: 'none', fontWeight: 500 }}>
            Entrar
          </Link>
          <Link to="/registro" style={{
            background: COR_PRIMARIA, color: '#fff', padding: '8px 18px',
            borderRadius: '4px', fontSize: '13px', fontWeight: 500, textDecoration: 'none',
          }}>Começar grátis</Link>
        </div>
      ) : (
        <button onClick={() => setMenuAberto(!menuAberto)} style={{
          background: 'transparent', border: 'none', color: '#fff',
          fontSize: '22px', cursor: 'pointer', padding: '4px',
        }}>
          {menuAberto ? '✕' : '☰'}
        </button>
      )}

      {isMobile && menuAberto && (
        <div style={{
          position: 'absolute', top: '60px', left: 0, right: 0,
          background: COR_SECUNDARIA, padding: '16px 20px',
          display: 'flex', flexDirection: 'column', gap: '4px',
          borderTop: '1px solid rgba(255,255,255,0.08)', zIndex: 200,
        }}>
          {['Funcionalidades', 'Como funciona', 'Preços'].map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`}
              onClick={() => setMenuAberto(false)}
              style={{
                color: 'rgba(255,255,255,0.7)', fontSize: '14px',
                textDecoration: 'none', padding: '10px 0',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}>
              {item}
            </a>
          ))}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
            <Link to="/login" style={{
              color: 'rgba(255,255,255,0.7)', fontSize: '14px',
              textDecoration: 'none', textAlign: 'center', padding: '10px',
              border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px',
            }}>Entrar</Link>
            <Link to="/registro" style={{
              background: COR_PRIMARIA, color: '#fff', padding: '10px',
              borderRadius: '4px', fontSize: '14px', fontWeight: 600,
              textDecoration: 'none', textAlign: 'center',
            }}>Começar grátis</Link>
          </div>
        </div>
      )}
    </nav>
  )
}

function Hero() {
  const { isMobile, isTablet } = useBreakpoint()
  const ehPequeno = isMobile || isTablet

  return (
    <section style={{
      background: COR_SECUNDARIA,
      padding: isMobile ? '48px 20px' : isTablet ? '64px 40px' : '96px 64px 80px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      flexDirection: ehPequeno ? 'column' : 'row',
      gap: ehPequeno ? '40px' : '64px',
    }}>
      <div style={{ maxWidth: ehPequeno ? '100%' : '560px' }}>
        <div style={{
          display: 'inline-block', background: COR_SUCESSO + '20',
          color: COR_SUCESSO, fontSize: '11px', fontWeight: 600,
          padding: '4px 12px', borderRadius: '4px', marginBottom: '24px',
          textTransform: 'uppercase', letterSpacing: '0.08em',
        }}>
          Novo — Relatórios em tempo real
        </div>
        <h1 style={{
          fontSize: isMobile ? '32px' : '48px', fontWeight: 700, color: '#fff',
          lineHeight: 1.15, marginBottom: '20px', letterSpacing: '-0.02em',
        }}>
          Controle financeiro para sua empresa
        </h1>
        <p style={{
          fontSize: isMobile ? '14px' : '16px', color: 'rgba(255,255,255,0.5)',
          lineHeight: 1.7, marginBottom: '40px',
        }}>
          Gerencie receitas, despesas e relatórios em tempo real. Simples, seguro e eficiente para pequenas e médias empresas.
        </p>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Link to="/registro" style={{
            background: COR_PRIMARIA, color: '#fff',
            padding: isMobile ? '12px 20px' : '12px 28px',
            borderRadius: '4px', fontSize: '14px', fontWeight: 600, textDecoration: 'none',
            flex: isMobile ? 1 : 'none', textAlign: 'center',
          }}>
            Começar gratuitamente →
          </Link>
          <a href="#como-funciona" style={{
            color: 'rgba(255,255,255,0.55)', fontSize: '14px',
            textDecoration: 'none', fontWeight: 500,
          }}>
            Ver demonstração
          </a>
        </div>
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)', marginTop: '16px' }}>
          Sem cartão de crédito · Configuração em 2 minutos
        </p>
      </div>

      <div style={{
        background: COR_CARD, borderRadius: '6px', padding: '24px',
        width: isMobile ? '100%' : isTablet ? '100%' : '440px',
        flexShrink: 0, boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
      }}>
        <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#d63031' }} />
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f39c12' }} />
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#00b894' }} />
          <span style={{ fontSize: '12px', color: '#888', marginLeft: '8px' }}>Dashboard — Março 2026</span>
        </div>
        {[
          { label: 'SALDO ATUAL', valor: 'R$ 4.530,00', cor: COR_TEXTO, borda: COR_PRIMARIA },
          { label: 'TOTAL RECEITAS', valor: 'R$ 5.000,00', cor: COR_SUCESSO, borda: COR_SUCESSO },
          { label: 'TOTAL DESPESAS', valor: 'R$ 470,00', cor: '#d63031', borda: '#d63031' },
        ].map(({ label, valor, cor, borda }) => (
          <div key={label} style={{
            background: '#d8d8d2', borderRadius: '4px', padding: '14px 16px',
            marginBottom: '10px', borderLeft: `3px solid ${borda}`,
          }}>
            <p style={{ fontSize: '10px', fontWeight: 500, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>{label}</p>
            <p style={{ fontSize: isMobile ? '18px' : '20px', fontWeight: 700, color: cor }}>{valor}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function Funcionalidades() {
  const { isMobile, isTablet } = useBreakpoint()
  const colunas = isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)'

  const items = [
    { icone: '↕', titulo: 'Controle de fluxo de caixa', desc: 'Registre receitas e despesas com categorias personalizadas e acompanhe seu saldo em tempo real.' },
    { icone: '▦', titulo: 'Relatórios inteligentes', desc: 'Visualize seus gastos por categoria, período e tipo. Tome decisões baseadas em dados.' },
    { icone: '◉', titulo: 'Multi-empresa', desc: 'Cada empresa tem seu ambiente isolado e seguro. Gerencie múltiplas organizações na mesma plataforma.' },
    { icone: '⊞', titulo: 'Categorias personalizadas', desc: 'Crie categorias com cores para organizar suas transações do jeito que faz sentido para o seu negócio.' },
    { icone: '✓', titulo: 'Acesso seguro', desc: 'Autenticação com tokens JWT. Seus dados protegidos com as melhores práticas de segurança.' },
    { icone: '↗', titulo: 'Acesso de qualquer lugar', desc: 'Plataforma 100% web. Acesse do computador, tablet ou celular sem precisar instalar nada.' },
  ]

  return (
    <section id="funcionalidades" style={{ padding: isMobile ? '64px 20px' : '96px 64px', background: COR_FUNDO }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h2 style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: 700, color: COR_TEXTO, marginBottom: '12px' }}>
          Tudo que você precisa para controlar suas finanças
        </h2>
        <p style={{ fontSize: '15px', color: COR_TEXTO_SUAVE, maxWidth: '480px', margin: '0 auto' }}>
          Funcionalidades pensadas para pequenas e médias empresas.
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: colunas, gap: '16px', maxWidth: '1100px', margin: '0 auto' }}>
        {items.map(({ icone, titulo, desc }) => (
          <div key={titulo} style={{
            background: COR_CARD, borderRadius: '6px', padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            transition: 'transform 0.15s, box-shadow 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.10)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)' }}
          >
            <div style={{
              width: '40px', height: '40px', background: COR_PRIMARIA + '15',
              borderRadius: '4px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '20px', color: COR_PRIMARIA, marginBottom: '16px',
            }}>{icone}</div>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: COR_TEXTO, marginBottom: '8px' }}>{titulo}</h3>
            <p style={{ fontSize: '13px', color: COR_TEXTO_SUAVE, lineHeight: 1.6 }}>{desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function ComoFunciona() {
  const { isMobile, isTablet } = useBreakpoint()
  const colunas = isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)'

  const passos = [
    { num: '01', titulo: 'Crie sua organização', desc: 'Cadastre sua empresa em menos de 2 minutos. Sem burocracia, sem cartão de crédito.' },
    { num: '02', titulo: 'Configure suas categorias', desc: 'Crie categorias personalizadas para organizar suas receitas e despesas.' },
    { num: '03', titulo: 'Registre suas transações', desc: 'Adicione receitas e despesas de forma simples e rápida, com data e categoria.' },
    { num: '04', titulo: 'Acompanhe os relatórios', desc: 'Visualize seu fluxo de caixa e relatórios atualizados em tempo real no dashboard.' },
  ]

  return (
    <section id="como-funciona" style={{ padding: isMobile ? '64px 20px' : '96px 64px', background: COR_SECUNDARIA }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h2 style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
          Como funciona
        </h2>
        <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.45)', maxWidth: '480px', margin: '0 auto' }}>
          Comece a usar em minutos. Sem complicação.
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: colunas, gap: '32px', maxWidth: '1100px', margin: '0 auto' }}>
        {passos.map(({ num, titulo, desc }) => (
          <div key={num} style={{ textAlign: 'center' }}>
            <div style={{
              width: '48px', height: '48px', background: COR_PRIMARIA,
              borderRadius: '4px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: '#fff', fontWeight: 700,
              fontSize: '16px', margin: '0 auto 20px',
            }}>{num}</div>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: '8px' }}>{titulo}</h3>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>{desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function Precos() {
  const { isMobile, isTablet } = useBreakpoint()
  const colunas = isMobile ? '1fr' : isTablet ? '1fr' : 'repeat(3, 1fr)'

  const planos = [
    {
      nome: 'Gratuito', preco: 'R$ 0', periodo: '/mês',
      desc: 'Para começar a organizar suas finanças.',
      destaque: false,
      features: ['1 usuário', 'Até 100 transações/mês', 'Categorias personalizadas', 'Dashboard básico'],
    },
    {
      nome: 'Pro', preco: 'R$ 49', periodo: '/mês',
      desc: 'Para empresas que querem crescer com controle.',
      destaque: true,
      features: ['Até 5 usuários', 'Transações ilimitadas', 'Relatórios avançados', 'Suporte prioritário', 'Exportação em PDF', 'Assistente IA'],
    },
    {
      nome: 'Enterprise', preco: 'Sob consulta', periodo: '',
      desc: 'Para empresas com necessidades específicas.',
      destaque: false,
      features: ['Usuários ilimitados', 'Múltiplas organizações', 'Integrações via API', 'Suporte dedicado', 'SLA garantido'],
    },
  ]

  return (
    <section id="preços" style={{ padding: isMobile ? '64px 20px' : '96px 64px', background: COR_FUNDO }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h2 style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: 700, color: COR_TEXTO, marginBottom: '12px' }}>
          Planos e preços
        </h2>
        <p style={{ fontSize: '15px', color: COR_TEXTO_SUAVE, maxWidth: '480px', margin: '0 auto' }}>
          Comece gratuitamente e faça upgrade quando precisar.
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: colunas, gap: '20px', maxWidth: '900px', margin: '0 auto' }}>
        {planos.map(({ nome, preco, periodo, desc, destaque, features }) => (
          <div key={nome} style={{
            background: destaque ? COR_SECUNDARIA : COR_CARD,
            borderRadius: '6px', padding: '32px',
            border: destaque ? `2px solid ${COR_PRIMARIA}` : '2px solid transparent',
            boxShadow: destaque ? '0 8px 32px rgba(9,132,227,0.15)' : '0 2px 8px rgba(0,0,0,0.06)',
            position: 'relative',
          }}>
            {destaque && (
              <div style={{
                position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
                background: COR_PRIMARIA, color: '#fff', fontSize: '11px', fontWeight: 600,
                padding: '4px 14px', borderRadius: '4px', whiteSpace: 'nowrap',
              }}>Mais popular</div>
            )}
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: destaque ? '#fff' : COR_TEXTO, marginBottom: '4px' }}>{nome}</h3>
            <p style={{ fontSize: '12px', color: destaque ? 'rgba(255,255,255,0.45)' : COR_TEXTO_SUAVE, marginBottom: '20px' }}>{desc}</p>
            <div style={{ marginBottom: '24px' }}>
              <span style={{ fontSize: '32px', fontWeight: 700, color: destaque ? '#fff' : COR_TEXTO }}>{preco}</span>
              <span style={{ fontSize: '13px', color: destaque ? 'rgba(255,255,255,0.45)' : COR_TEXTO_SUAVE }}>{periodo}</span>
            </div>
            <div style={{ borderTop: `1px solid ${destaque ? 'rgba(255,255,255,0.1)' : '#d0d0ca'}`, paddingTop: '20px', marginBottom: '24px' }}>
              {features.map((f) => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <span style={{ color: COR_SUCESSO, fontSize: '12px', fontWeight: 700 }}>✓</span>
                  <span style={{ fontSize: '13px', color: destaque ? 'rgba(255,255,255,0.65)' : COR_TEXTO_SUAVE }}>{f}</span>
                </div>
              ))}
            </div>
            <Link to="/registro" style={{
              display: 'block', textAlign: 'center',
              background: destaque ? COR_PRIMARIA : 'transparent',
              color: destaque ? '#fff' : COR_PRIMARIA,
              border: destaque ? 'none' : `1px solid ${COR_PRIMARIA}`,
              padding: '10px', borderRadius: '4px',
              fontSize: '13px', fontWeight: 600, textDecoration: 'none',
            }}>
              {nome === 'Enterprise' ? 'Falar com vendas' : 'Começar agora'}
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}

function Rodape() {
  const { isMobile, isTablet } = useBreakpoint()
  const colunas = isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : '2fr 1fr 1fr 1fr'

  return (
    <footer style={{ background: COR_SECUNDARIA, padding: isMobile ? '48px 20px 24px' : '64px 64px 32px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: colunas, gap: isMobile ? '32px' : '48px', marginBottom: '48px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <div style={{
              width: '28px', height: '28px', background: COR_PRIMARIA,
              borderRadius: '4px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '14px',
            }}>F</div>
            <span style={{ color: '#fff', fontWeight: 600, fontSize: '14px' }}>FinancialManager</span>
          </div>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.7, maxWidth: '260px' }}>
            Sistema SaaS de gestão financeira para pequenas empresas. Controle seu fluxo de caixa com simplicidade.
          </p>
        </div>
        {[
          { titulo: 'Produto', links: ['Funcionalidades', 'Preços', 'Changelog'] },
          { titulo: 'Suporte', links: ['Documentação', 'Contato', 'Política de privacidade'] },
          { titulo: 'Empresa', links: ['Sobre', 'GitHub', 'LinkedIn'] },
        ].map(({ titulo, links }) => (
          <div key={titulo}>
            <h4 style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
              {titulo}
            </h4>
            {links.map((link) => (
              <a key={link} href="#" style={{
                display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.45)',
                textDecoration: 'none', marginBottom: '10px', transition: 'color 0.15s',
              }}
                onMouseEnter={e => e.target.style.color = '#fff'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.45)'}
              >{link}</a>
            ))}
          </div>
        ))}
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>
          © 2026 FinancialManager. Todos os direitos reservados.
        </p>
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>
          Desenvolvido por KreaKodo
        </p>
      </div>
    </footer>
  )
}
