# FinancialManager

Sistema SaaS de gestão financeira para pequenas empresas — controle de fluxo de caixa, categorias e relatórios em tempo real, com arquitetura multi-tenant e autenticação segura.

## Sobre o projeto

O FinancialManager permite que múltiplas empresas utilizem a mesma aplicação de forma totalmente isolada — cada organização enxerga apenas seus próprios dados, usuários e configurações.

O projeto é desenvolvido seguindo boas práticas de mercado: commits semânticos, separação de responsabilidades em apps Django, autenticação stateless com JWT, containerização completa com Docker e design system consistente com identidade visual própria.

## Tecnologias

**Backend**
- Python 3.12 + Django 5 + Django REST Framework
- Autenticação JWT com SimpleJWT
- PostgreSQL 16
- pytest + pytest-django para testes automatizados
- reportlab para geração de PDF
- anthropic SDK para integração com IA

**Frontend**
- React 18 + Vite
- Tailwind CSS + Chart.js
- Axios com interceptor de refresh token
- React Router v6 com rotas protegidas
- Fonte Inter (Google Fonts)

**Infraestrutura**
- Docker + Docker Compose
- python-decouple para variáveis de ambiente

## Funcionalidades

**Autenticação e Organizações**
- Cadastro de organizações com usuário administrador
- Autenticação JWT com renovação automática de token
- Isolamento total de dados por organização (multi-tenancy)
- Gerenciamento de usuários com perfis: Administrador e Colaborador

**Financeiro**
- CRUD de transações (receitas e despesas) com categorias personalizadas
- Filtros por tipo, categoria e período
- Contas a pagar e receber com controle de vencimento
- Transações recorrentes (diária, semanal, mensal, anual)
- Exportação de relatórios em PDF

**Dashboard e Relatórios**
- Cards de métricas: saldo, receitas e despesas do período
- Gráfico de receitas por categoria
- Gráfico de despesas por categoria
- Gráfico comparativo receitas vs despesas
- Gráfico de evolução mensal do saldo
- Atualização automática ao adicionar transações

**Produto**
- Landing page pública com planos e preços
- Onboarding guiado para novos usuários
- Sidebar recolhível com navegação responsiva
- Configurações de perfil, segurança e organização
- Sistema de planos (Gratuito, Pro, Enterprise) com trial de 14 dias
- Assistente financeiro com IA (feature exclusiva do Plano Pro)

## Como rodar localmente

**Pré-requisitos:** Docker e Docker Compose instalados.

**1. Clone o repositório**
```bash
git clone https://github.com/KreaKodo/financial-manager-kreakodo.git
cd financial-manager-kreakodo
```

**2. Configure as variáveis de ambiente**
```bash
cp .env.example .env
```

Edite o `.env` com seus valores:
```
DEBUG=True
SECRET_KEY=sua-chave-secreta
DB_NOME=financial_db
DB_USUARIO=financial_user
DB_SENHA=financial_pass
DB_HOST=banco
DB_PORTA=5432
ANTHROPIC_API_KEY=sua-chave-anthropic (opcional, apenas para feature Pro)
```

**3. Suba os containers**
```bash
docker compose up -d
```

**4. Rode as migrations**
```bash
docker compose run --rm backend python manage.py migrate
```

**5. Crie um superusuário (opcional)**
```bash
docker compose run --rm backend python manage.py createsuperuser
```

**6. Acesse a aplicação**
- Landing page: http://localhost:5174
- Frontend (app): http://localhost:5174/login
- Backend API: http://localhost:8000
- Django Admin: http://localhost:8000/admin

## Endpoints da API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/auth/registro/` | Registrar nova organização |
| POST | `/api/auth/login/` | Login (retorna JWT) |
| POST | `/api/auth/refresh/` | Renovar access token |
| GET | `/api/auth/perfil/` | Perfil do usuário autenticado |
| PATCH | `/api/auth/perfil/` | Atualizar nome do usuário |
| POST | `/api/auth/alterar-senha/` | Alterar senha |
| GET | `/api/auth/usuarios/` | Listar usuários da organização |
| POST | `/api/auth/usuarios/criar/` | Criar novo usuário |
| PATCH | `/api/auth/usuarios/{id}/` | Atualizar perfil do usuário |
| DELETE | `/api/auth/usuarios/{id}/` | Remover usuário |
| GET/POST | `/api/categorias/` | Listar e criar categorias |
| GET/PUT/DELETE | `/api/categorias/{id}/` | Detalhe da categoria |
| GET/POST | `/api/transacoes/` | Listar e criar transações |
| GET/PUT/DELETE | `/api/transacoes/{id}/` | Detalhe da transação |
| GET | `/api/relatorios/resumo/` | Resumo financeiro por período |
| GET | `/api/relatorios/por-categoria/` | Despesas por categoria |
| GET | `/api/relatorios/receitas-por-categoria/` | Receitas por categoria |
| GET | `/api/relatorios/evolucao-mensal/` | Evolução mensal do saldo |
| GET | `/api/relatorios/exportar-pdf/` | Exportar relatório em PDF |
| POST | `/api/relatorios/assistente/` | Assistente financeiro IA (Pro) |
| GET | `/api/assinatura/status/` | Status do plano e trial |

## Testes
```bash
# Todos os testes
docker compose run --rm backend pytest -v

# Apenas autenticação
docker compose run --rm backend pytest apps/accounts/tests.py -v

# Apenas transações
docker compose run --rm backend pytest apps/transactions/tests.py -v

# Testes e2e
docker compose run --rm backend pytest apps/tests_e2e.py -v
```

## Estrutura do projeto
```
financial-manager/
├── backend/
│   ├── apps/
│   │   ├── accounts/      # Usuários, organizações e autenticação
│   │   ├── transactions/  # Receitas, despesas e categorias
│   │   └── reports/       # Relatórios, resumos e assistente IA
│   ├── core/              # Settings, URLs e configurações globais
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── contexts/      # AuthContext e AtualizacaoContext
│   │   ├── hooks/         # Hooks customizados
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── services/      # Configuração do axios
│   │   └── styles/        # Variáveis e breakpoints CSS
│   └── Dockerfile
├── docker-compose.yml
├── .env.example
└── README.md
```

## Decisões técnicas

**Multi-tenancy a nível de aplicação:** Os dados são isolados via chave estrangeira `organizacao` em todos os modelos. Todas as queries são automaticamente filtradas pela organização do usuário autenticado via permissões customizadas no DRF. Abordagem simples de manter e suficiente para o escopo do produto.

**JWT stateless:** SimpleJWT com access token de 15 minutos e refresh token de 7 dias. O frontend renova automaticamente o access token via interceptor do axios sem interromper a experiência do usuário.

**Separação de apps Django:** Cada domínio do negócio (`accounts`, `transactions`, `reports`) tem seu próprio app com models, serializers, views e URLs independentes, facilitando manutenção e escalabilidade.

**Docker Compose:** Todos os serviços (backend, frontend, banco) são orquestrados via Docker, garantindo ambiente reproduzível em qualquer máquina independente do sistema operacional.

**Design system próprio:** Paleta de cores definida em variáveis CSS globais (`#1a1a2e`, `#0984e3`, `#00b894`), tipografia Inter e componentes com estilo consistente em toda a aplicação.

**Feature flags por plano:** Funcionalidades premium (assistente IA, exportação PDF, recorrência) são controladas via permissões no backend com retorno HTTP 402, garantindo que o controle de acesso nunca dependa apenas do frontend.

## Roadmap

| Sprint | Tema | Status |
|--------|------|--------|
| 0 | Configuração e Fundação | ✅ Concluído |
| 1 | Autenticação e Organizações | ✅ Concluído |
| 2 | Módulo de Transações | ✅ Concluído |
| 3 | Relatórios e Frontend Base | ✅ Concluído |
| 4 | Frontend Completo e Integração | ✅ Concluído |
| 5 | Redesign Visual e Sidebar | ✅ Concluído |
| 6 | Landing Page Pública | ✅ Concluído |
| 7 | Onboarding | ✅ Concluído |
| 8 | Configurações da Conta | ✅ Concluído |
| 9 | Integração com IA (Feature Pro) | ⏳ Em espera |
| 10 | Responsividade Mobile | 🔜 A fazer |
| 11 | Funcionalidades Financeiras Avançadas | 📋 Backlog |
| 12 | Monetização e Planos | 📋 Backlog |
| 13 | Fundação Mobile (React Native) | 📋 Backlog |

## Contribuindo

Este projeto é desenvolvido pela equipe KreaKodo. Para contribuir:

1. Crie uma branch a partir de `main` com o nome da feature: `feat/nome-da-feature`
2. Siga o padrão de commits semânticos: `feat:`, `fix:`, `docs:`, `chore:`, `test:`, `refactor:`
3. Abra um Pull Request descrevendo as mudanças realizadas
4. Aguarde a revisão de pelo menos um membro da equipe antes do merge

---

Desenvolvido por [KreaKodo](https://github.com/KreaKodo)
