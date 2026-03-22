from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import RegistroOrganizacaoSerializer, UsuarioSerializer
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


class PerfilUsuarioView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UsuarioSerializer(request.user)
        return Response(serializer.data)
