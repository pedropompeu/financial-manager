from django.urls import path
from .views import RegistroOrganizacaoView, PerfilUsuarioView, UsuariosOrganizacaoView, UsuariosOrganizacaoView

urlpatterns = [
    path('registro/', RegistroOrganizacaoView.as_view(), name='registro'),
    path('perfil/', PerfilUsuarioView.as_view(), name='perfil'),
    path('usuarios/', UsuariosOrganizacaoView.as_view(), name='usuarios'),
]
