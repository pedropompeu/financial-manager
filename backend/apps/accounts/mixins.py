from .permissions import MembroOrganizacao, MesmaOrganizacao


class FiltroOrganizacaoMixin:
    """
    Mixin que filtra automaticamente os querysets pela organizacao
    do usuario autenticado. Deve ser usado em todos os ViewSets
    que lidam com dados isolados por organizacao.
    """
    permission_classes = [MembroOrganizacao]

    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset.filter(organizacao=self.request.user.organizacao)

    def perform_create(self, serializer):
        serializer.save(organizacao=self.request.user.organizacao)
