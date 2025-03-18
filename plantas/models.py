from django.db import models
from django.conf import settings

# Create your models here.
class ProblemaPlanta(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)
    sintomas = models.TextField(blank=True)
    tratamiento = models.TextField(blank=True)
    imagen = models.ImageField(upload_to='', blank=True, null=True)

    class Meta: 
        abstract = True

    def __str__(self):
        return self.nombre

class Enfermedad(ProblemaPlanta):
    imagen = models.ImageField(upload_to='enfermedades/', blank=True, null=True)

class Plaga(ProblemaPlanta):
    imagen = models.ImageField(upload_to='plagas/', blank=True, null=True)



class Especie(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)
    origen = models.CharField(max_length=20)
    descubridor = models.CharField(max_length=100)

    def __str__ (self):
        return self.nombre
    

class Planta(models.Model):
    nombre = models.CharField(max_length=100)
    especie = models.ForeignKey(Especie, on_delete=models.PROTECT, related_name='plantas')
    descripcion = models.TextField(blank=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    imagen = models.ImageField(upload_to='plantas/', blank=True, null=True)
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="plantas")

    def __str__ (self):
        return self.nombre