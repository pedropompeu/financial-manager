import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from apps.accounts.models import Organizacao, Usuario
from apps.transactions.models import Categoria, Transacao


@pytest.fixture
def cliente():
    return APIClient()


@pytest.fixture
def organizacao():
    return Organizacao.objects.create(nome='Org Teste', slug='org-teste')


@pytest.fixture
def organizacao_2():
    return Organizacao.objects.create(nome='Org Teste 2', slug='org-teste-2')


@pytest.fixture
def usuario(organizacao):
    return Usuario.objects.create_user(
        email='usuario@teste.com',
        password='senha1234',
        nome='Usuario Teste',
        organizacao=organizacao,
        perfil=Usuario.PERFIL_ADMIN,
    )


@pytest.fixture
def usuario_2(organizacao_2):
    return Usuario.objects.create_user(
        email='usuario2@teste.com',
        password='senha1234',
        nome='Usuario Teste 2',
        organizacao=organizacao_2,
        perfil=Usuario.PERFIL_ADMIN,
    )


@pytest.fixture
def cliente_autenticado(cliente, usuario):
    url = reverse('login')
    resposta = cliente.post(url, {
        'email': 'usuario@teste.com',
        'password': 'senha1234',
    }, format='json')
    cliente.credentials(HTTP_AUTHORIZATION=f'Bearer {resposta.data["access"]}')
    return cliente


@pytest.fixture
def categoria(organizacao):
    return Categoria.objects.create(
        nome='Salario', cor='#22c55e', organizacao=organizacao
    )


@pytest.fixture
def transacao(organizacao, categoria):
    return Transacao.objects.create(
        descricao='Salario mensal',
        valor='5000.00',
        tipo=Transacao.TIPO_RECEITA,
        data='2026-03-01',
        categoria=categoria,
        organizacao=organizacao,
    )


@pytest.mark.django_db
class TesteCategoria:
    def teste_criar_categoria(self, cliente_autenticado):
        resposta = cliente_autenticado.post(
            reverse('categoria-list'),
            {'nome': 'Alimentacao', 'cor': '#ef4444'},
            format='json',
        )
        assert resposta.status_code == 201
        assert resposta.data['nome'] == 'Alimentacao'

    def teste_listar_apenas_categorias_da_organizacao(
        self, cliente_autenticado, categoria, organizacao_2
    ):
        Categoria.objects.create(
            nome='Categoria Outra Org', cor='#000000', organizacao=organizacao_2
        )
        resposta = cliente_autenticado.get(reverse('categoria-list'))
        assert resposta.status_code == 200
        nomes = [c['nome'] for c in resposta.data['results']]
        assert 'Salario' in nomes
        assert 'Categoria Outra Org' not in nomes

    def teste_categoria_nome_duplicado(self, cliente_autenticado, categoria):
        resposta = cliente_autenticado.post(
            reverse('categoria-list'),
            {'nome': 'Salario', 'cor': '#000000'},
            format='json',
        )
        assert resposta.status_code == 400


@pytest.mark.django_db
class TesteTransacao:
    def teste_criar_receita(self, cliente_autenticado, categoria):
        resposta = cliente_autenticado.post(
            reverse('transacao-list'),
            {
                'descricao': 'Freelance',
                'valor': '1500.00',
                'tipo': 'receita',
                'data': '2026-03-15',
                'categoria': categoria.id,
            },
            format='json',
        )
        assert resposta.status_code == 201
        assert resposta.data['tipo'] == 'receita'

    def teste_criar_despesa(self, cliente_autenticado, categoria):
        resposta = cliente_autenticado.post(
            reverse('transacao-list'),
            {
                'descricao': 'Aluguel',
                'valor': '1200.00',
                'tipo': 'despesa',
                'data': '2026-03-10',
                'categoria': categoria.id,
            },
            format='json',
        )
        assert resposta.status_code == 201
        assert resposta.data['tipo'] == 'despesa'

    def teste_listar_apenas_transacoes_da_organizacao(
        self, cliente_autenticado, transacao, organizacao_2, categoria
    ):
        Transacao.objects.create(
            descricao='Transacao outra org',
            valor='999.00',
            tipo=Transacao.TIPO_DESPESA,
            data='2026-03-01',
            organizacao=organizacao_2,
        )
        resposta = cliente_autenticado.get(reverse('transacao-list'))
        assert resposta.status_code == 200
        assert resposta.data['count'] == 1
        assert resposta.data['results'][0]['descricao'] == 'Salario mensal'

    def teste_filtro_por_tipo(self, cliente_autenticado, transacao, organizacao, categoria):
        Transacao.objects.create(
            descricao='Aluguel',
            valor='1200.00',
            tipo=Transacao.TIPO_DESPESA,
            data='2026-03-10',
            organizacao=organizacao,
            categoria=categoria,
        )
        resposta = cliente_autenticado.get(
            reverse('transacao-list') + '?tipo=receita'
        )
        assert resposta.status_code == 200
        assert resposta.data['count'] == 1
        assert resposta.data['results'][0]['tipo'] == 'receita'

    def teste_filtro_por_periodo(self, cliente_autenticado, organizacao, categoria):
        Transacao.objects.create(
            descricao='Janeiro',
            valor='1000.00',
            tipo=Transacao.TIPO_RECEITA,
            data='2026-01-15',
            organizacao=organizacao,
        )
        Transacao.objects.create(
            descricao='Marco',
            valor='2000.00',
            tipo=Transacao.TIPO_RECEITA,
            data='2026-03-15',
            organizacao=organizacao,
        )
        resposta = cliente_autenticado.get(
            reverse('transacao-list') + '?data_inicio=2026-03-01&data_fim=2026-03-31'
        )
        assert resposta.status_code == 200
        assert resposta.data['count'] == 1
        assert resposta.data['results'][0]['descricao'] == 'Marco'

    def teste_usuario_outra_org_nao_acessa(self, cliente, usuario_2, transacao):
        url = reverse('login')
        resposta = cliente.post(url, {
            'email': 'usuario2@teste.com',
            'password': 'senha1234',
        }, format='json')
        cliente.credentials(
            HTTP_AUTHORIZATION=f'Bearer {resposta.data["access"]}'
        )
        resposta = cliente.get(reverse('transacao-list'))
        assert resposta.status_code == 200
        assert resposta.data['count'] == 0
