from rest_framework import viewsets
from apps.accounts.mixins import FiltroOrganizacaoMixin
from .models import Categoria, Transacao
from .serializers import CategoriaSerializer, TransacaoSerializer


class CategoriaViewSet(FiltroOrganizacaoMixin, viewsets.ModelViewSet):
    serializer_class = CategoriaSerializer
    queryset = Categoria.objects.all()


class TransacaoViewSet(FiltroOrganizacaoMixin, viewsets.ModelViewSet):
    serializer_class = TransacaoSerializer
    queryset = Transacao.objects.select_related('categoria')
