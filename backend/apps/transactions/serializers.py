from rest_framework import serializers
from .models import Categoria, Transacao


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id', 'nome', 'cor']

    def validate_nome(self, valor):
        organizacao = self.context['request'].user.organizacao
        qs = Categoria.objects.filter(nome=valor, organizacao=organizacao)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError('Ja existe uma categoria com este nome.')
        return valor


class TransacaoSerializer(serializers.ModelSerializer):
    categoria_nome = serializers.CharField(source='categoria.nome', read_only=True)
    categoria_cor = serializers.CharField(source='categoria.cor', read_only=True)

    class Meta:
        model = Transacao
        fields = [
            'id', 'descricao', 'valor', 'tipo', 'data',
            'categoria', 'categoria_nome', 'categoria_cor',
            'criado_em', 'atualizado_em',
        ]
        read_only_fields = ['id', 'criado_em', 'atualizado_em']

    def validate_categoria(self, valor):
        if valor and valor.organizacao != self.context['request'].user.organizacao:
            raise serializers.ValidationError('Categoria invalida.')
        return valor
