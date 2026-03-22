import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from apps.accounts.models import Organizacao, Usuario
from apps.transactions.models import Categoria, Transacao


@pytest.fixture
def cliente():
    return APIClient()


@pytest.fixture
def org_a():
    return Organizacao.objects.create(nome='Empresa A', slug='empresa-a')


@pytest.fixture
def org_b():
    return Organizacao.objects.create(nome='Empresa B', slug='empresa-b')


@pytest.fixture
def usuario_a(org_a):
    return Usuario.objects.create_user(
        email='admin@empresa-a.com',
        password='senha1234',
        nome='Admin A',
        organizacao=org_a,
        perfil=Usuario.PERFIL_ADMIN,
    )


@pytest.fixture
def usuario_b(org_b):
    return Usuario.objects.create_user(
        email='admin@empresa-b.com',
        password='senha1234',
        nome='Admin B',
        organizacao=org_b,
        perfil=Usuario.PERFIL_ADMIN,
    )


def autenticar(cliente, email, senha):
    resposta = cliente.post(reverse('login'), {
        'email': email, 'password': senha
    }, format='json')
    cliente.credentials(HTTP_AUTHORIZATION=f'Bearer {resposta.data["access"]}')
    return cliente


@pytest.mark.django_db
class TesteFluxoCompleto:
    def teste_registro_e_login(self, cliente):
        resposta = cliente.post(reverse('registro'), {
            'nome_organizacao': 'Nova Empresa',
            'nome_usuario': 'Novo Usuario',
            'email': 'novo@empresa.com',
            'senha': 'senha1234',
        }, format='json')
        assert resposta.status_code == 201
        assert resposta.data['usuario']['perfil'] == 'admin'

        login = cliente.post(reverse('login'), {
            'email': 'novo@empresa.com',
            'password': 'senha1234',
        }, format='json')
        assert login.status_code == 200
        assert 'access' in login.data
        assert 'refresh' in login.data

    def teste_criar_transacao_e_verificar_resumo(self, cliente, usuario_a):
        autenticar(cliente, 'admin@empresa-a.com', 'senha1234')

        categoria = Categoria.objects.create(
            nome='Salario', cor='#22c55e', organizacao=usuario_a.organizacao
        )

        cliente.post(reverse('transacao-list'), {
            'descricao': 'Salario março',
            'valor': '5000.00',
            'tipo': 'receita',
            'data': '2026-03-01',
            'categoria': categoria.id,
        }, format='json')

        cliente.post(reverse('transacao-list'), {
            'descricao': 'Aluguel',
            'valor': '1500.00',
            'tipo': 'despesa',
            'data': '2026-03-05',
            'categoria': categoria.id,
        }, format='json')

        resumo = cliente.get(
            reverse('resumo') + '?data_inicio=2026-03-01&data_fim=2026-03-31'
        )
        assert resumo.status_code == 200
        assert float(resumo.data['total_receitas']) == 5000.00
        assert float(resumo.data['total_despesas']) == 1500.00
        assert float(resumo.data['saldo']) == 3500.00

    def teste_filtro_transacoes_por_periodo(self, cliente, usuario_a):
        autenticar(cliente, 'admin@empresa-a.com', 'senha1234')

        org = usuario_a.organizacao
        Transacao.objects.create(
            descricao='Janeiro', valor='1000.00',
            tipo='receita', data='2026-01-15', organizacao=org
        )
        Transacao.objects.create(
            descricao='Março', valor='2000.00',
            tipo='receita', data='2026-03-15', organizacao=org
        )

        resposta = cliente.get(
            reverse('transacao-list') + '?data_inicio=2026-03-01&data_fim=2026-03-31'
        )
        assert resposta.status_code == 200
        assert resposta.data['count'] == 1
        assert resposta.data['results'][0]['descricao'] == 'Março'

    def teste_isolamento_entre_organizacoes(self, cliente, usuario_a, usuario_b):
        autenticar(cliente, 'admin@empresa-a.com', 'senha1234')
        Transacao.objects.create(
            descricao='Transacao Empresa A',
            valor='9999.00',
            tipo='receita',
            data='2026-03-01',
            organizacao=usuario_a.organizacao,
        )

        autenticar(cliente, 'admin@empresa-b.com', 'senha1234')
        resposta = cliente.get(reverse('transacao-list'))
        assert resposta.status_code == 200
        assert resposta.data['count'] == 0

    def teste_acesso_negado_sem_organizacao(self, cliente):
        org = Organizacao.objects.create(nome='Org Temp', slug='org-temp')
        usuario = Usuario.objects.create_user(
            email='sem_org@teste.com',
            password='senha1234',
            nome='Sem Org',
            organizacao=None,
        )
        autenticar(cliente, 'sem_org@teste.com', 'senha1234')
        resposta = cliente.get(reverse('transacao-list'))
        assert resposta.status_code == 403
