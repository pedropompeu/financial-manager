from django.db import models
from apps.accounts.models import Organizacao


class Categoria(models.Model):
    nome = models.CharField(max_length=100)
    cor = models.CharField(max_length=7, default='#6366f1')
    organizacao = models.ForeignKey(
        Organizacao,
        on_delete=models.CASCADE,
        related_name='categorias',
    )

    class Meta:
        verbose_name = 'Categoria'
        verbose_name_plural = 'Categorias'
        ordering = ['nome']
        unique_together = ['nome', 'organizacao']

    def __str__(self):
        return self.nome


class Transacao(models.Model):
    TIPO_RECEITA = 'receita'
    TIPO_DESPESA = 'despesa'
    TIPOS = [
        (TIPO_RECEITA, 'Receita'),
        (TIPO_DESPESA, 'Despesa'),
    ]

    descricao = models.CharField(max_length=255)
    valor = models.DecimalField(max_digits=10, decimal_places=2)
    tipo = models.CharField(max_length=10, choices=TIPOS)
    data = models.DateField()
    categoria = models.ForeignKey(
        Categoria,
        on_delete=models.SET_NULL,
        related_name='transacoes',
        null=True,
        blank=True,
    )
    organizacao = models.ForeignKey(
        Organizacao,
        on_delete=models.CASCADE,
        related_name='transacoes',
    )
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Transacao'
        verbose_name_plural = 'Transacoes'
        ordering = ['-data', '-criado_em']

    def __str__(self):
        return f'{self.tipo} - {self.descricao} - R$ {self.valor}'
