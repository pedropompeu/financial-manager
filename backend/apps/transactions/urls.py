from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoriaViewSet, TransacaoViewSet

router = DefaultRouter()
router.register('categorias', CategoriaViewSet, basename='categoria')
router.register('transacoes', TransacaoViewSet, basename='transacao')

urlpatterns = [
    path('', include(router.urls)),
]
