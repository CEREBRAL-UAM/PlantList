from django.db import models

class SensadoAmbiental(models.Model):
    FechaSensado = models.DateTimeField(primary_key=True)
    TempAmbiental = models.FloatField(null=True)
    Humedad = models.FloatField(null=True)
    Lux = models.FloatField(null=True)
    Radiacion = models.FloatField(null=True)
    id_Circuito = models.IntegerField()
    id_EnergiaPlanta = models.IntegerField(null=True)
    Luz_Azul = models.FloatField(null=True)
    Luz_Blanca = models.FloatField(null=True)
    Luz_Roja = models.FloatField(null=True)

    class Meta:
        managed = False
        db_table = 'sensadoambiental'

    def __str__(self):
        return f"Sensado {self.FechaSensado}"

class sensadoSuelo(models.Model):
    id_EnergiaPlanta = models.AutoField(primary_key=True)
    id_Circuito = models.IntegerField()
    fechaSensado = models.DateTimeField()
    Voltaje = models.FloatField()
    Amperaje = models.FloatField()
    id_Electrodos = models.IntegerField()
    id_Suelo = models.IntegerField(null=True, blank=True)
    PhSuelo = models.CharField(max_length=45, null=True, blank=True)
    HumedadSuelo = models.FloatField(null=True, blank=True)
    id_PlantaIndividuo = models.IntegerField(null=True, blank=True)

    class Meta:
        managed = False
        db_table = 'sensadoSuelo'

    def __str__(self):
        return f"Sensado Suelo {self.fechaSensado}"

class SensadoContaminantes(models.Model):
    id_Circuito = models.IntegerField()
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
