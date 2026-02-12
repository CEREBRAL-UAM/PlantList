from django.db import models

class SensadoAmbiental(models.Model):
    FechaSensado = models.DateTimeField(primary_key=True)
    TempAmbiental = models.FloatField(null=True)
    Humedad = models.FloatField(null=True)
    Lux = models.FloatField(null=True)
    Radiacion = models.FloatField(null=True)
    bluetooth = models.IntegerField()
    Voltaje = models.FloatField(null=True)
    Amperaje = models.FloatField(null=True)
    Luz_Azul = models.FloatField(null=True)
    Luz_Blanca = models.FloatField(null=True)
    Luz_Roja = models.FloatField(null=True)

    class Meta:
        managed = False
        db_table = 'sensadoambiental'

    def __str__(self):
        return f"Sensado {self.FechaSensado}"

class Suelo(models.Model):
    id_Suelo = models.AutoField(primary_key=True)
    CP = models.IntegerField()
    Nombre_Cientifico = models.CharField(max_length=45, null=True)
    Descripcion = models.CharField(max_length=45, null=True)

    class Meta:
        managed = False
        db_table = 'suelo'

    def __str__(self):
        return f"Sensado {self.FechaSensado}"

class sensadoSuelo(models.Model):
    id_EnergiaPlanta = models.AutoField(primary_key=True)
    bluetooth = models.IntegerField()
    fechaSensado = models.DateTimeField()
    Voltaje = models.FloatField()
    Amperaje = models.FloatField()
    suelo = models.ForeignKey(Suelo, db_column='id_Suelo', null=True, blank=True, on_delete=models.DO_NOTHING)
    PhSuelo = models.CharField(max_length=45, null=True, blank=True)
    HumedadSuelo = models.FloatField(null=True, blank=True)
    id_PlantaIndividuo = models.IntegerField(null=True, blank=True)

    class Meta:
        managed = False
        db_table = 'sensadoSuelo'

    def __str__(self):
        return f"Sensado Suelo {self.fechaSensado}"

class SensadoContaminantes(models.Model):
    circuito = models.ForeignKey('Circuito', db_column='bluetooth', on_delete=models.DO_NOTHING)
    fechaSensado = models.DateTimeField(primary_key=True)
    CO = models.DecimalField(max_digits=5, decimal_places=2)
    CO2 = models.DecimalField(max_digits=5, decimal_places=2)
    O = models.DecimalField(max_digits=5, decimal_places=2)
    COVs = models.DecimalField(max_digits=5, decimal_places=2)

    class Meta:
        db_table = 'sensadocontaminantes'
        managed = False

    def __str__(self):
        return f"Contaminantes - {self.fechaSensado}"

class Circuito(models.Model):
    bluetooth = models.CharField(primary_key=True, max_length=45)
    id_tipo_circuito = models.IntegerField()
    id_espacios = models.IntegerField()

    class Meta:
        db_table = 'circuito'
        managed = False

class TipoCircuito(models.Model):
    id_tipo_circuito = models.AutoField(primary_key=True)
    descripcion = models.CharField(max_length=50)