from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin


class Organizacao(models.Model):
    nome = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    criado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Organizacao'
        verbose_name_plural = 'Organizacoes'

    def __str__(self):
        return self.nome


class GerenciadorUsuario(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('O e-mail e obrigatorio')
        email = self.normalize_email(email)
        usuario = self.model(email=email, **extra_fields)
        usuario.set_password(password)
        usuario.save(using=self._db)
        return usuario

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)


class Usuario(AbstractBaseUser, PermissionsMixin):
    PERFIL_ADMIN = 'admin'
    PERFIL_COLABORADOR = 'colaborador'
    PERFIS = [
        (PERFIL_ADMIN, 'Administrador'),
        (PERFIL_COLABORADOR, 'Colaborador'),
    ]

    email = models.EmailField(unique=True)
    nome = models.CharField(max_length=255)
    organizacao = models.ForeignKey(
        Organizacao,
        on_delete=models.CASCADE,
        related_name='usuarios',
        null=True,
        blank=True,
    )
    perfil = models.CharField(max_length=20, choices=PERFIS, default=PERFIL_COLABORADOR)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    criado_em = models.DateTimeField(auto_now_add=True)

    objects = GerenciadorUsuario()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nome']

    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'

    def __str__(self):
        return self.email
