from django.db import models
from django.core.validators import MinLengthValidator
from django.contrib.auth.models import AbstractUser


# Para iniciar sesion instale: 
# pip install dj-rest-auth, 
# pip install dj-rest-auth[with-social], 
# pip install django-allauth

# Create your models here.
class Usuario(AbstractUser):
    apellidoP = models.CharField(max_length=20)
    apellidoM = models.CharField(max_length=20)
    email = models.EmailField(unique=True)
    fotoPerfil = models.ImageField(upload_to='fotos_de_perfil/', blank=True, null=True)
    isAdmin = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'  # Usamos el email como identificador único
    REQUIRED_FIELDS = ['username']  # Django requiere algún otro campo obligatorio

    def __str__(self):
        return self.email