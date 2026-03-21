from rest_framework.permissions import BasePermission


class MembroOrganizacao(BasePermission):
    message = 'Voce nao pertence a nenhuma organizacao.'

    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.organizacao is not None
        )


class AdminOrganizacao(BasePermission):
    message = 'Apenas administradores podem realizar esta acao.'

    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.organizacao is not None and
            request.user.perfil == request.user.PERFIL_ADMIN
        )


class MesmaOrganizacao(BasePermission):
    message = 'Voce nao tem permissao para acessar este recurso.'

    def has_object_permission(self, request, view, obj):
        if hasattr(obj, 'organizacao'):
            return obj.organizacao == request.user.organizacao
        if hasattr(obj, 'organizacao_id'):
            return obj.organizacao_id == request.user.organizacao_id
        return False
