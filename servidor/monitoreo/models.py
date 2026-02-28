from django.db import models


class Usuario(models.Model):
    id_Usuario = models.AutoField(primary_key=True, db_column='id_Usuario')
    Nombre = models.CharField(max_length=45, db_column='Nombre')
    ApellidoPaterno = models.CharField(max_length=20, db_column='ApellidoPaterno')
    ApellidoMaterno = models.CharField(max_length=20, db_column='ApellidoMaterno')
    Telefono = models.CharField(max_length=15, db_column='Telefono')
    CorreoElectronico = models.CharField(
        max_length=100,
        db_column='CorreoElectronico',
        unique=True
    )
    Contrasenia = models.CharField(max_length=128, db_column='Contrasenia')
    Foto = models.CharField(max_length=150, null=True, db_column='Foto')

    TipoUsuario = models.CharField(
        max_length=20,
        db_column='TipoUsuario',
        choices=[
            ('isAdmin', 'isAdmin'),
            ('isSuscrito', 'isSuscrito'),
            ('isParticipant', 'isParticipant'),
        ],
        null=True,
        blank=True,
    )

    class Meta:
        managed = False
        db_table = 'usuario'

    def __str__(self):
        return f"Usuario {self.id_Usuario} - {self.CorreoElectronico}"


class Espacios(models.Model):
    id_espacios = models.AutoField(primary_key=True, db_column='id_espacios')
    nombre_espacio = models.CharField(max_length=45, null=True, db_column='nombre_espacio')
    Foto = models.CharField(max_length=150, null=True, db_column='Foto')
    clave_acceso = models.CharField(max_length=45, db_column='clave_acceso')

    class Meta:
        managed = False
        db_table = 'espacios'

    def __str__(self):
        return f"Espacio {self.id_espacios} - {self.nombre_espacio or ''}"


class EspaciosUsuarios(models.Model):
    usuario = models.ForeignKey(
        Usuario,
        db_column='id_Usuario',
        on_delete=models.DO_NOTHING,
        related_name='espacios_usuarios'
    )
    espacio = models.ForeignKey(
        Espacios,
        db_column='id_espacios',
        on_delete=models.DO_NOTHING,
        related_name='usuarios_espacios'
    )
    isAdmin = models.BooleanField(db_column='isAdmin', default=False)

    class Meta:
        managed = False
        db_table = 'espaciosUsuarios'
        unique_together = (('usuario', 'espacio'),)


class TipoCircuitos(models.Model):
    id_tipo_circuito = models.AutoField(
        db_column='id_tipo_circuito', primary_key=True
    )
    descripcion = models.CharField(
        db_column='descripcion',
        max_length=50,
        blank=True,
    )

    class Meta:
        managed = False
        db_table = 'tipoCircuitos'

    def __str__(self):
        return self.nombre or f"Tipo {self.id_tipo_circuito}"


class Circuito(models.Model):
    bluetooth = models.CharField(
        primary_key=True,
        max_length=45,
        db_column='bluetooth',
    )

    tipo = models.ForeignKey(
        TipoCircuitos,
        db_column='id_tipo_circuito',
        on_delete=models.DO_NOTHING,
        related_name='circuitos',
    )

    espacio = models.ForeignKey(
        Espacios,
        db_column='id_espacios',
        on_delete=models.DO_NOTHING,
        related_name='circuitos',
    )

    class Meta:
        managed = False
        db_table = 'circuito'

    def __str__(self):
        return f"Circuito {self.bluetooth}"


class SensadoAmbiental(models.Model):
    FechaSensado = models.DateTimeField(
        primary_key=True,
        db_column='FechaSensado',
    )
    TempAmbiental = models.FloatField(null=True, db_column='TempAmbiental')
    Humedad = models.FloatField(null=True, db_column='Humedad')
    Lux = models.FloatField(null=True, db_column='Lux')
    Radiacion = models.FloatField(null=True, db_column='Radiacion')
    Voltaje = models.FloatField(null=True, db_column="Voltaje")
    Amperaje = models.FloatField(null=True, db_column="Amperaje")

    circuito = models.ForeignKey(
        Circuito,
        db_column='bluetooth',
        to_field='bluetooth',
        on_delete=models.DO_NOTHING,
        related_name='sensados_ambientales',
    )

    Luz_Azul = models.FloatField(null=True, db_column='Luz_Azul')
    Luz_Blanca = models.FloatField(null=True, db_column='Luz_Blanca')
    Luz_Roja = models.FloatField(null=True, db_column='Luz_Roja')

    class Meta:
        managed = False
        db_table = 'sensadoambiental'

    def __str__(self):
        return f"Sensado Ambiental {self.FechaSensado}"


class Suelo(models.Model):
    id_Suelo = models.AutoField(primary_key=True, db_column='id_Suelo')
    CP = models.IntegerField(db_column='CP')
    Nombre_Cientifico = models.CharField(max_length=45, null=True, db_column='Nombre_Cientifico')
    Descripcion = models.CharField(max_length=45, null=True, db_column='Descripcion')

    class Meta:
        managed = False
        db_table = 'suelo'

    def __str__(self):
        return f"Suelo {self.id_Suelo}"


class sensadoSuelo(models.Model):
    fechaSensado = models.DateTimeField(primary_key=True, db_column='fechaSensado')

    circuito = models.ForeignKey(
        Circuito,
        db_column='bluetooth',
        to_field='bluetooth',
        on_delete=models.DO_NOTHING,
        related_name='sensados_suelo',
    )

    Voltaje = models.FloatField(db_column='Voltaje')
    Amperaje = models.FloatField(db_column='Amperaje')

    suelo = models.ForeignKey(
        Suelo,
        db_column='id_Suelo',
        on_delete=models.DO_NOTHING,
        related_name='sensados_suelo',
        null=True,
        blank=True,
    )

    PhSuelo = models.CharField(max_length=45, null=True, blank=True, db_column='PhSuelo')
    HumedadSuelo = models.FloatField(null=True, blank=True, db_column='HumedadSuelo')

    id_PlantaIndividuo = models.IntegerField(db_column='id_PlantaIndividuo', null=True, blank=True)

    class Meta:
        managed = False
        db_table = 'sensadoSuelo'
        
    def __str__(self):
        return f"Sensado Suelo {self.fechaSensado} - {self.circuito_id}"


class SensadoContaminantes(models.Model):
    circuito = models.ForeignKey(
        Circuito,
        db_column='bluetooth',
        to_field='bluetooth',
        on_delete=models.DO_NOTHING,
        related_name='sensados_contaminantes',
    )
    fechaSensado = models.DateTimeField(primary_key=True, db_column='fechaSensado')
    CO = models.DecimalField(max_digits=5, decimal_places=2, db_column='CO')
    CO2 = models.DecimalField(max_digits=5, decimal_places=2, db_column='CO2')
    O = models.DecimalField(max_digits=5, decimal_places=2, db_column='O')
    COVs = models.DecimalField(max_digits=5, decimal_places=2, db_column='COVs')

    class Meta:
        managed = False
        db_table = 'sensadocontaminantes'

    def __str__(self):
        return f"Contaminantes - {self.fechaSensado}"
