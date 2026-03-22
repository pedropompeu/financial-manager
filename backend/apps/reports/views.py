from django.db.models import Sum, Q
from rest_framework.response import Response
from rest_framework.views import APIView
from apps.accounts.permissions import MembroOrganizacao
from apps.transactions.models import Transacao, Categoria


class ResumoFinanceiroView(APIView):
    permission_classes = [MembroOrganizacao]

    def get(self, request):
        organizacao = request.user.organizacao
        data_inicio = request.query_params.get('data_inicio')
        data_fim = request.query_params.get('data_fim')

        transacoes = Transacao.objects.filter(organizacao=organizacao)

        if data_inicio:
            transacoes = transacoes.filter(data__gte=data_inicio)
        if data_fim:
            transacoes = transacoes.filter(data__lte=data_fim)

        totais = transacoes.aggregate(
            total_receitas=Sum('valor', filter=Q(tipo=Transacao.TIPO_RECEITA)),
            total_despesas=Sum('valor', filter=Q(tipo=Transacao.TIPO_DESPESA)),
        )

        total_receitas = totais['total_receitas'] or 0
        total_despesas = totais['total_despesas'] or 0
        saldo = total_receitas - total_despesas

        return Response({
            'saldo': saldo,
            'total_receitas': total_receitas,
            'total_despesas': total_despesas,
            'periodo': {
                'data_inicio': data_inicio,
                'data_fim': data_fim,
            }
        })


class DespesasPorCategoriaView(APIView):
    permission_classes = [MembroOrganizacao]

    def get(self, request):
        organizacao = request.user.organizacao
        data_inicio = request.query_params.get('data_inicio')
        data_fim = request.query_params.get('data_fim')

        transacoes = Transacao.objects.filter(
            organizacao=organizacao,
            tipo=Transacao.TIPO_DESPESA,
        )

        if data_inicio:
            transacoes = transacoes.filter(data__gte=data_inicio)
        if data_fim:
            transacoes = transacoes.filter(data__lte=data_fim)

        por_categoria = (
            transacoes
            .values('categoria__id', 'categoria__nome', 'categoria__cor')
            .annotate(total=Sum('valor'))
            .order_by('-total')
        )

        resultado = [
            {
                'categoria_id': item['categoria__id'],
                'categoria_nome': item['categoria__nome'] or 'Sem categoria',
                'categoria_cor': item['categoria__cor'] or '#888888',
                'total': item['total'],
            }
            for item in por_categoria
        ]

        return Response(resultado)
