import django_filters
from .models import Transacao


class TransacaoFilter(django_filters.FilterSet):
    data_inicio = django_filters.DateFilter(field_name='data', lookup_expr='gte')
    data_fim = django_filters.DateFilter(field_name='data', lookup_expr='lte')

    class Meta:
        model = Transacao
        fields = ['tipo', 'categoria', 'data_inicio', 'data_fim']
