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
