from django.urls import path
from .views import ResumoFinanceiroView, DespesasPorCategoriaView

urlpatterns = [
    path('relatorios/resumo/', ResumoFinanceiroView.as_view(), name='resumo'),
    path('relatorios/por-categoria/', DespesasPorCategoriaView.as_view(), name='por-categoria'),
]
