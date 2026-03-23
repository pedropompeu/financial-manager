from django.db import transaction
from rest_framework import serializers
from .models import Organizacao, Usuario


class RegistroOrganizacaoSerializer(serializers.Serializer):
    nome_organizacao = serializers.CharField(max_length=255)
    nome_usuario = serializers.CharField(max_length=255)
    email = serializers.EmailField()
    senha = serializers.CharField(min_length=8, write_only=True)

    def validate_email(self, valor):
        if Usuario.objects.filter(email=valor).exists():
            raise serializers.ValidationError('Este e-mail já está cadastrado.')
        return valor

    def validate_nome_organizacao(self, valor):
        from django.utils.text import slugify
        slug = slugify(valor)
        if Organizacao.objects.filter(slug=slug).exists():
            raise serializers.ValidationError('Já existe uma organização com este nome.')
        return valor

    @transaction.atomic
    def create(self, validated_data):
        from django.utils.text import slugify
        organizacao = Organizacao.objects.create(
            nome=validated_data['nome_organizacao'],
            slug=slugify(validated_data['nome_organizacao']),
        )
        usuario = Usuario.objects.create_user(
            email=validated_data['email'],
            password=validated_data['senha'],
            nome=validated_data['nome_usuario'],
            organizacao=organizacao,
            perfil=Usuario.PERFIL_ADMIN,
        )
        return usuario


class CriarUsuarioSerializer(serializers.Serializer):
    nome = serializers.CharField(max_length=255)
    email = serializers.EmailField()
    perfil = serializers.ChoiceField(choices=['admin', 'colaborador'])
    senha = serializers.CharField(min_length=8, write_only=True)

    def validate_email(self, valor):
        if Usuario.objects.filter(email=valor).exists():
            raise serializers.ValidationError('Este e-mail já está cadastrado.')
        return valor

    def create(self, validated_data):
        organizacao = self.context['request'].user.organizacao
        return Usuario.objects.create_user(
            email=validated_data['email'],
            password=validated_data['senha'],
            nome=validated_data['nome'],
            organizacao=organizacao,
            perfil=validated_data['perfil'],
        )


class UsuarioSerializer(serializers.ModelSerializer):
    organizacao_nome = serializers.CharField(
        source='organizacao.nome', read_only=True
    )

    class Meta:
        model = Usuario
        fields = ['id', 'email', 'nome', 'perfil', 'organizacao_nome', 'criado_em']
        read_only_fields = ['id', 'criado_em']
