from rest_framework import viewsets
from rest_framework.filters import OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from apps.accounts.mixins import FiltroOrganizacaoMixin
from .models import Categoria, Transacao
from .serializers import CategoriaSerializer, TransacaoSerializer
from .filters import TransacaoFilter


class CategoriaViewSet(FiltroOrganizacaoMixin, viewsets.ModelViewSet):
    serializer_class = CategoriaSerializer
    queryset = Categoria.objects.all()


class TransacaoViewSet(FiltroOrganizacaoMixin, viewsets.ModelViewSet):
    serializer_class = TransacaoSerializer
    queryset = Transacao.objects.select_related('categoria')
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = TransacaoFilter
    ordering_fields = ['data', 'valor', 'criado_em']
    ordering = ['-data']
