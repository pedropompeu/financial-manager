import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from apps.accounts.models import Organizacao, Usuario


@pytest.fixture
def cliente():
    return APIClient()


@pytest.fixture
def dados_registro():
    return {
        'nome_organizacao': 'Organizacao Teste',
        'nome_usuario': 'Usuario Teste',
        'email': 'teste@organizacao.com',
        'senha': 'senha1234',
    }


@pytest.fixture
def usuario_criado(dados_registro):
    organizacao = Organizacao.objects.create(
        nome='Org Fixture', slug='org-fixture'
    )
    return Usuario.objects.create_user(
        email='fixture@teste.com',
        password='senha1234',
        nome='Usuario Fixture',
        organizacao=organizacao,
        perfil=Usuario.PERFIL_ADMIN,
    )


@pytest.mark.django_db
class TesteRegistroOrganizacao:
    def teste_registro_com_sucesso(self, cliente, dados_registro):
        url = reverse('registro')
        resposta = cliente.post(url, dados_registro, format='json')
        assert resposta.status_code == 201
        assert resposta.data['mensagem'] == 'Organização criada com sucesso!'
        assert resposta.data['usuario']['email'] == dados_registro['email']
        assert resposta.data['usuario']['perfil'] == 'admin'

    def teste_registro_email_duplicado(self, cliente, dados_registro, usuario_criado):
        dados_registro['email'] = usuario_criado.email
        url = reverse('registro')
        resposta = cliente.post(url, dados_registro, format='json')
        assert resposta.status_code == 400
        assert 'email' in resposta.data

    def teste_registro_dados_invalidos(self, cliente):
        url = reverse('registro')
        resposta = cliente.post(url, {}, format='json')
        assert resposta.status_code == 400

    def teste_registro_senha_curta(self, cliente, dados_registro):
        dados_registro['senha'] = '123'
        url = reverse('registro')
        resposta = cliente.post(url, dados_registro, format='json')
        assert resposta.status_code == 400


@pytest.mark.django_db
class TesteAutenticacaoJWT:
    def teste_login_com_sucesso(self, cliente, usuario_criado):
        url = reverse('login')
        resposta = cliente.post(url, {
            'email': 'fixture@teste.com',
            'password': 'senha1234',
        }, format='json')
        assert resposta.status_code == 200
        assert 'access' in resposta.data
        assert 'refresh' in resposta.data

    def teste_login_credenciais_incorretas(self, cliente, usuario_criado):
        url = reverse('login')
        resposta = cliente.post(url, {
            'email': 'fixture@teste.com',
            'password': 'senhaerrada',
        }, format='json')
        assert resposta.status_code == 401

    def teste_acesso_sem_token(self, cliente):
        url = reverse('perfil')
        resposta = cliente.get(url)
        assert resposta.status_code == 401

    def teste_acesso_com_token_valido(self, cliente, usuario_criado):
        login_url = reverse('login')
        login = cliente.post(login_url, {
            'email': 'fixture@teste.com',
            'password': 'senha1234',
        }, format='json')
        token = login.data['access']
        url = reverse('perfil')
        cliente.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        resposta = cliente.get(url)
        assert resposta.status_code == 200
        assert resposta.data['email'] == 'fixture@teste.com'

    def teste_refresh_token(self, cliente, usuario_criado):
        login_url = reverse('login')
        login = cliente.post(login_url, {
            'email': 'fixture@teste.com',
            'password': 'senha1234',
        }, format='json')
        refresh = login.data['refresh']
        url = reverse('token_refresh')
        resposta = cliente.post(url, {'refresh': refresh}, format='json')
        assert resposta.status_code == 200
        assert 'access' in resposta.data
