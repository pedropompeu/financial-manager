from django.urls import path
from .views import RegistroOrganizacaoView, PerfilUsuarioView, UsuariosOrganizacaoView, CriarUsuarioView, AtualizarUsuarioView, UsuariosOrganizacaoView

urlpatterns = [
    path('registro/', RegistroOrganizacaoView.as_view(), name='registro'),
    path('perfil/', PerfilUsuarioView.as_view(), name='perfil'),
    path('usuarios/', UsuariosOrganizacaoView.as_view(), name='usuarios'),
    path('usuarios/criar/', CriarUsuarioView.as_view(), name='criar-usuario'),
    path('usuarios/<int:pk>/', AtualizarUsuarioView.as_view(), name='atualizar-usuario'),
]
