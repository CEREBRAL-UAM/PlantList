from django.db import models
from django.conf import settings

# Create your models here.
class ModeloGenerico(models.Model):
    nombre_cientifico = models.CharField(max_length=45, blank=True)  
    alias = models.CharField(max_length=45, blank=True)
    descripcion = models.CharField(max_length=300, blank=True)

    class Meta:
        abstract = True

    def __str__(self):
        return self.nombre_cientifico

class Especie(ModeloGenerico):
    id_especies = models.AutoField(primary_key=True)
    foto = models.ImageField(upload_to='especies/', blank=True, null=True)
    origen = models.CharField(max_length=45, blank=True)
    id_Planta = models.ForeignKey(
        'Planta',  
        on_delete=models.CASCADE,
        db_column='id_Planta'
    )

    class Meta:
        db_table = 'especies'
    

class Planta(ModeloGenerico):
    id_planta = models.AutoField(primary_key=True)
    id_espacios = models.ForeignKey( 
        'Espacio',  
        on_delete=models.CASCADE,
        db_column='id_espacios'
    )
    foto = models.ImageField(upload_to='plantas/', blank=True, null=True)
    familia = models.CharField(max_length=45, blank=True)

    class Meta:
        db_table = 'plantas' 
        unique_together = (('id_planta', 'id_espacios'),)


class PartePlanta(ModeloGenerico):
    id_PartePlanta = models.AutoField(primary_key=True)
    foto = models.ImageField(upload_to='partes/', blank=True, null=True)

    class Meta: 
        db_table = 'partesdeplanta'
        

class PlantaPartes(models.Model):
    id_parteplanta = models.IntegerField(db_column='id_PartePlanta', primary_key=True)

    id_planta = models.ForeignKey(
        'Planta',  
        on_delete=models.CASCADE,
        db_column='id_Planta'      
    )

    class Meta:
        db_table = 'plantapartes'
        managed = False
        unique_together = (('id_parteplanta', 'id_planta'),)

    def __str__(self):
        return f"Planta ID {self.id_planta} - Parte ID {self.id_parteplanta}"


class Espacio(models.Model):
    id_espacios = models.AutoField(primary_key=True)
    nombre_espacio = models.CharField(max_length=45, blank=True) 
    foto = models.ImageField(upload_to='espacios/', blank=True, null=True)  
    clave_acceso = models.CharField(max_length=45, blank=True) 

    usuarios_miembros = models.ManyToManyField(
    'usuarios.Usuario',
    through='EspaciosUsuarios',
    related_name='usuarios_miembros'
    )

    class Meta:
        db_table = 'espacios'

    def __str__(self):
        return self.nombre_espacio
    
class EspaciosUsuarios(models.Model):
    id_usuario = models.ForeignKey(
        'usuarios.Usuario',
        on_delete=models.CASCADE,
        db_column='id_Usuario'
    )

    id_espacios = models.ForeignKey(
        'Espacio',  
        on_delete=models.CASCADE,
        db_column='id_espacios'
    )

    isAdmin = models.BooleanField(default=False)
    class Meta:
        db_table = 'espaciosusuarios'
        managed = False
        unique_together = (('id_espacios', 'id_usuario'),)
    
    def __str__(self):
        return self.id_usuario
