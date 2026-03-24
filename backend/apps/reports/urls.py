from django.urls import path
from .views import ResumoFinanceiroView, DespesasPorCategoriaView, ReceitasPorCategoriaView
from .ia import AssistenteIAView

urlpatterns = [
    path('relatorios/resumo/', ResumoFinanceiroView.as_view(), name='resumo'),
    path('relatorios/por-categoria/', DespesasPorCategoriaView.as_view(), name='por-categoria'),
    path('relatorios/receitas-por-categoria/', ReceitasPorCategoriaView.as_view(), name='receitas-por-categoria'),
    path('relatorios/assistente/', AssistenteIAView.as_view(), name='assistente-ia'),
]
