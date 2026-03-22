# FinancialManager

Plataforma SaaS de gestão financeira multi-tenant desenvolvida como projeto de portfólio.

## Sobre o projeto

O FinancialManager permite que múltiplas empresas utilizem a mesma aplicação de forma totalmente isolada — cada organização enxerga apenas seus próprios dados, usuários e configurações.

O projeto foi construído seguindo boas práticas de mercado: commits semânticos, separação de responsabilidades em apps Django, autenticação stateless com JWT e containerização completa com Docker.

## Tecnologias

**Backend**
- Python 3.12 + Django 5 + Django REST Framework
- Autenticação JWT com SimpleJWT
- PostgreSQL 16
- pytest + pytest-django para testes

**Frontend**
- React 18 + Vite
- Tailwind CSS
- Axios com interceptor de refresh token

**Infraestrutura**
- Docker + Docker Compose
- python-decouple para variáveis de ambiente

## Funcionalidades

- Cadastro de organizações com usuário administrador
- Autenticação JWT com renovação automática de token
- Isolamento de dados por organização (multi-tenancy)
- CRUD de transações financeiras (receitas e despesas)
- Categorias personalizadas por organização
- Filtros por tipo, categoria e período
- Dashboard com resumo financeiro e despesas por categoria
- Gerenciamento de usuários por organização

## Como rodar localmente

**Pré-requisitos:** Docker e Docker Compose instalados.

**1. Clone o repositório**
```bash
git clone https://github.com/pedropompeu/financial-manager.git
cd financial-manager
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
- Frontend: http://localhost:5174
- Backend API: http://localhost:8000
- Django Admin: http://localhost:8000/admin

## Endpoints da API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/auth/registro/` | Registrar nova organização |
| POST | `/api/auth/login/` | Login (retorna JWT) |
| POST | `/api/auth/refresh/` | Renovar access token |
| GET | `/api/auth/perfil/` | Perfil do usuário autenticado |
| GET | `/api/auth/usuarios/` | Listar usuários da organização |
| GET/POST | `/api/categorias/` | Listar e criar categorias |
| GET/PUT/DELETE | `/api/categorias/{id}/` | Detalhe da categoria |
| GET/POST | `/api/transacoes/` | Listar e criar transações |
| GET/PUT/DELETE | `/api/transacoes/{id}/` | Detalhe da transação |
| GET | `/api/relatorios/resumo/` | Resumo financeiro por período |
| GET | `/api/relatorios/por-categoria/` | Despesas agrupadas por categoria |

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

## Decisões técnicas

**Multi-tenancy a nível de aplicação:** Optei por filtrar os dados via chave estrangeira `organizacao` em vez de usar schemas separados no banco. Essa abordagem é mais simples de manter e suficiente para o escopo do projeto.

**JWT stateless:** O uso de SimpleJWT com refresh token garante autenticação segura sem necessidade de sessões no servidor, ideal para uma API consumida por um SPA.

**Separação de apps Django:** Cada domínio do negócio (`accounts`, `transactions`, `reports`) tem seu próprio app, facilitando manutenção e escalabilidade futura.

**Docker Compose:** Todos os serviços (backend, frontend, banco) são orquestrados via Docker, garantindo ambiente reproduzível em qualquer máquina.

---

Desenvolvido por [Pedro Luiz Pompeu da Silva](https://github.com/pedropompeu)
