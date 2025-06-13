from django.db import models

# Create your models here.

class Usuario(models.Model):
    id_Usuario  = models.AutoField(primary_key=True)
    Nombre = models.CharField(max_length=45)
    ApellidoPaterno = models.CharField(max_length=20)
    ApellidoMaterno = models.CharField(max_length=20)
    Telefono = models.CharField(max_length=15)
    CorreoElectronico = models.CharField(max_length=100, unique=True)
    Contrasenia = models.CharField(max_length=128)

    class Meta:
        db_table = 'usuario'

    def __str__(self):
        return self.CorreoElectronico

    def is_authenticated(self):
        return True  

class TokenUsuario(models.Model):
    id_tokens = models.AutoField(primary_key=True)
    usuario = models.OneToOneField('Usuario',db_column='id_Usuario', on_delete=models.CASCADE)
    token = models.CharField(max_length=128, unique=True)

    class Meta:
        db_table = 'tokens'

    def __str__(self): 
        return self.usuario