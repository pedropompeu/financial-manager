from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import RegistroOrganizacaoSerializer, UsuarioSerializer, CriarUsuarioSerializer
from .models import Usuario


class RegistroOrganizacaoView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegistroOrganizacaoSerializer(data=request.data)
        if serializer.is_valid():
            usuario = serializer.save()
            return Response(
                {
                    'mensagem': 'Organização criada com sucesso!',
                    'usuario': UsuarioSerializer(usuario).data,
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UsuariosOrganizacaoView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UsuarioSerializer

    def get_queryset(self):
        from apps.accounts.permissions import AdminOrganizacao
        return Usuario.objects.filter(organizacao=self.request.user.organizacao)


class CriarUsuarioView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.perfil != Usuario.PERFIL_ADMIN:
            raise PermissionDenied('Apenas administradores podem criar usuarios.')
        serializer = CriarUsuarioSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            usuario = serializer.save()
            return Response(UsuarioSerializer(usuario).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AtualizarUsuarioView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        if request.user.perfil != Usuario.PERFIL_ADMIN:
            raise PermissionDenied('Apenas administradores podem editar usuarios.')
        try:
            usuario = Usuario.objects.get(pk=pk, organizacao=request.user.organizacao)
        except Usuario.DoesNotExist:
            return Response({'detail': 'Usuario nao encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        if 'perfil' in request.data:
            usuario.perfil = request.data['perfil']
            usuario.save()
        return Response(UsuarioSerializer(usuario).data)

    def delete(self, request, pk):
        if request.user.perfil != Usuario.PERFIL_ADMIN:
            raise PermissionDenied('Apenas administradores podem remover usuarios.')
        try:
            usuario = Usuario.objects.get(pk=pk, organizacao=request.user.organizacao)
        except Usuario.DoesNotExist:
            return Response({'detail': 'Usuario nao encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        if usuario.pk == request.user.pk:
            return Response({'detail': 'Voce nao pode remover a si mesmo.'}, status=status.HTTP_400_BAD_REQUEST)
        usuario.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class PerfilUsuarioView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UsuarioSerializer(request.user)
        return Response(serializer.data)
