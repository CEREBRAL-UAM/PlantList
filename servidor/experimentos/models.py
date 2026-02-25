from django.db import models

class TipoEstimulacion(models.Model):
    id_TipoEstimulacion = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=20, blank=True)
    descripcion = models.CharField(max_length=45, blank=True)
    
    class Meta:
        db_table = 'tipoestimulacion'
    
class Material(models.Model):
    id_material = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=45, blank=True)
    descripcion = models.CharField(max_length=550, blank=True)

    class Meta:
        db_table = 'material'

class Electrodos(models.Model):
    id_electrodos = models.AutoField(primary_key=True)
    id_material = models.ForeignKey(
        'Material',
        on_delete=models.CASCADE,
        db_column='id_Material'
    )
    forma = models.CharField(max_length=45)
    largo = models.CharField(max_length=45)
    ancho = models.CharField(max_length=45)
    calibre_cable = models.CharField(max_length=45)

    class Meta:
        db_table = 'electrodos'

class Ubicaciones(models.Model):
    cp = models.IntegerField(primary_key=True)
    estado = models.CharField(max_length=45,blank=True)
    municipio = models.CharField(max_length=45, blank=True)
    colonia = models.CharField(max_length=45, blank=True)

    class Meta:
        db_table = 'ubicaciones'
    
class Suelo(models.Model):
    id_suelo = models.AutoField(primary_key=True)
    # ph = models.CharField(max_length=45, blank=True)
    # conductividad = models.FloatField
    cp = models.ForeignKey(
        'Ubicaciones',
        on_delete=models.CASCADE,
        db_column='CP'
    )
    nombre_cientifico = models.CharField(max_length=45, blank=True)
    descripcion = models.CharField(max_length=45, blank=True)

    class Meta:
        db_table = 'suelo'

class EtapaDesarrollo(models.Model):
    id_etapa = models.AutoField(primary_key=True)
    nombre_cientifico = models.CharField(max_length=45, blank=True)
    alias = models.CharField(max_length=45, blank=True)

    class Meta:
        db_table = 'etapadesarrollo'

class OrigenCrianza(models.Model):
    id_OrigenCrianza = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=45, blank=True)
    descripcion = models.CharField(max_length=550, blank=True)

    class Meta:
        db_table = 'origencrianzaplanta'
    
class Plagas(models.Model):
    id_plaga = models.AutoField(primary_key=True)
    nombre_cientifico = models.CharField(max_length=45, blank=True)
    alias = models.CharField(max_length=45, blank=True)
    descripcion = models.CharField(max_length=150, blank=True)
    tratamiento = models.CharField(max_length=150, blank=True)

    class Meta:
        db_table = 'plagas'
    
class PlantaIndividuo(models.Model):
    id_PlantaIndividuo = models.AutoField(primary_key=True)
    id_suelo = models.ForeignKey(
        'Suelo',
        on_delete=models.CASCADE,
        db_column='id_Suelo'
    )
    id_planta = models.ForeignKey(
        'plantas.Planta',
        on_delete=models.CASCADE,
        db_column='id_Planta'
    )
    id_etapa = models.ForeignKey(
        'EtapaDesarrollo',
        on_delete=models.CASCADE,
        db_column='id_Etapa'
    )
    id_OrigenCrianza = models.ForeignKey(
        'OrigenCrianza',
        on_delete=models.CASCADE,
        db_column='id_OrigenCrianza'
    )
    plagas_id_Plaga = models.ForeignKey(
        'Plagas',
        on_delete=models.CASCADE,
        db_column='plagas_id_Plaga'
    )
    id_espacios = models.ForeignKey(
        'plantas.Espacio',
        on_delete=models.CASCADE,
        db_column='id_espacios'
    )

    class Meta:
        db_table = 'plantaindividuo'

class Video(models.Model):
    id_Video = models.AutoField(primary_key=True)
    codigo_unico = models.CharField(max_length=80, unique=True)
    archivo = models.FileField(upload_to="videos/")

    class Meta:
        db_table = "video"

class Experimento(models.Model):
    id_Experimento = models.AutoField(primary_key=True)
    id_TipoEstimulacion = models.ForeignKey(
        'TipoEstimulacion',
        on_delete=models.CASCADE,
        db_column='id_TipoEstimulacion'
    )
    id_PartePlanta = models.ForeignKey(
        'plantas.PartePlanta',
        on_delete=models.CASCADE,
        db_column='id_PartePlanta',
        null=True,
        blank=True
    )
    Fecha_Sensado = models.DateField()
    Hora_inicio = models.DateTimeField()
    Hora_fin = models.DateTimeField()
    id_PlantaIndividuo = models.ForeignKey(
        'PlantaIndividuo',
        on_delete=models.CASCADE,
        db_column='id_PlantaIndividuo'
    )
    id_Electrodos = models.ForeignKey(
        'Electrodos',
        on_delete=models.CASCADE,
        db_column='id_electrodos'
    )
    bluetooth = models.ForeignKey(
        'monitoreo.Circuito',
        on_delete=models.CASCADE,
        db_column='bluetooth'
    )
    id_Video = models.ForeignKey(
        'Video',
        on_delete=models.CASCADE,
        db_column='id_Video'
    )
    id_Usuario = models.ForeignKey(
        'usuarios.Usuario',
        on_delete=models.CASCADE,
        db_column='id_Usuario'
    )
    id_espacios = models.ForeignKey(
        'plantas.Espacio',
        on_delete=models.CASCADE,
        db_column='id_espacios'
    )
    id_plaga = models.ForeignKey(
        'Plagas',
        on_delete=models.CASCADE,
        db_column="id_plaga",
        null=True,
        blank=True
    )

    class Meta:
        db_table = 'experimento'
