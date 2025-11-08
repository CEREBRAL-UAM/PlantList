from django.core.management.base import BaseCommand
from plantas.utils import generar_clave_acceso_unica
from plantas.models import Espacio, Especie, Planta, EspaciosUsuarios, PlantasEspacios
from usuarios.models import Usuario, TokenUsuario
from experimentos.models import (
    TipoEstimulacion, Material, Electrodos, Ubicaciones, Suelo,
    EtapaDesarrollo, OrigenCrianza, Plagas, PlantaIndividuo
)
from django.contrib.auth.hashers import make_password
from django.core.files import File
import uuid
import os
from django.db import connection, transaction

class Command(BaseCommand):
    help = 'Llena la base de datos con datos de prueba incluyendo fotos'

    def handle(self, *args, **options):
        base_dir = 'media/demo/'  

        # --- BORRADO EN ORDEN SEGURO (primero intermedias que dependan de Planta/Espacio) ---
        # Intermedia plantas_espacios
        try:
            PlantasEspacios.objects.all().delete()
        except Exception:
            # Si aún no existe la tabla/modelo, continuamos sin fallar
            pass

        # Borro la info de pruebas anteriores
        Planta.objects.all().delete()
        Especie.objects.all().delete()
        Espacio.objects.all().delete()
        Usuario.objects.all().delete()
        TokenUsuario.objects.all().delete()

        # Experimentos
        PlantaIndividuo.objects.all().delete()
        Electrodos.objects.all().delete()
        Plagas.objects.all().delete()
        OrigenCrianza.objects.all().delete()
        EtapaDesarrollo.objects.all().delete()
        Suelo.objects.all().delete()
        Ubicaciones.objects.all().delete()
        Material.objects.all().delete()
        TipoEstimulacion.objects.all().delete()

        # --- USUARIOS ---
        usuario_demo = Usuario.objects.create(
            Nombre="Carlos",
            ApellidoPaterno="Pérez",
            ApellidoMaterno="López",
            Telefono="5551234567",
            CorreoElectronico="alguien@algo.com",
            Contrasenia=make_password("1234"),
        )

        usuario_admin_demo = Usuario.objects.create(
            Nombre="Montserrat",
            ApellidoPaterno="Adonis",
            ApellidoMaterno="Martinez",
            Telefono="5554234337",
            CorreoElectronico="alguien2@algo.com",
            Contrasenia=make_password("1234"),
            TipoUsuario='isAdmin'
        )

        foto_usuario = os.path.join(base_dir, "usuario.jpg")
        with open(foto_usuario, "rb") as img_file:
            usuario_demo.Foto.save("usuario.jpg", File(img_file), save=True)

        TokenUsuario.objects.create(usuario=usuario_demo, token=str(uuid.uuid4()))
        TokenUsuario.objects.create(usuario=usuario_admin_demo, token=str(uuid.uuid4()))

        self.stdout.write(self.style.SUCCESS("Usuarios (admin y participante) creados con exito !"))

        # --- ESPACIOS ---
        espacios_data = [
            {"nombre_espacio": "Patio",    "foto": os.path.join(base_dir, "espacio1.jpg"), "clave_acceso": generar_clave_acceso_unica()},
            {"nombre_espacio": "Encinal",  "foto": os.path.join(base_dir, "espacio2.jpg"), "clave_acceso": generar_clave_acceso_unica()},
            {"nombre_espacio": "Interior", "foto": os.path.join(base_dir, "espacio3.jpg"), "clave_acceso": generar_clave_acceso_unica()},
        ]
        espacios = []
        for data in espacios_data:
            with open(data["foto"], "rb") as img_file:
                espacio = Espacio(nombre_espacio=data["nombre_espacio"], clave_acceso=data["clave_acceso"])
                espacio.foto.save(os.path.basename(data["foto"]), File(img_file), save=True)
                espacios.append(espacio)
                EspaciosUsuarios.objects.create(
                    id_usuario=usuario_demo,
                    id_espacios=espacio,
                    isAdminEspacio=True
                )

        self.stdout.write(self.style.SUCCESS("Espacios creados con imágenes."))

        # --- PLANTAS + RELACIONES EN TABLA INTERMEDIA ---
        # Nota: mantenemos 'id_espacios' dentro de cada dict SOLO para saber a qué espacio va,
        # pero ya no lo pasamos al constructor de Planta.
        plantas_data = [
            # Espacio 0 - 4 plantas con foto
            {
                "nombre_cientifico": "Ficus Lindo",
                "alias": "Mi Ficus",
                "descripcion": "Esta planta de interiores no solo embellece cualquier habitación con sus hojas verdes brillantes, sino que también ayuda a purificar el aire. Requiere luz indirecta y riego moderado.",
                "familia": "Moraceae",
                "id_espacios": espacios[0],
                "foto": os.path.join(base_dir, "planta.jpg")
            },
            {
                "nombre_cientifico": "Helecho Feliz",
                "alias": "Fernie",
                "descripcion": "Perfecto para ambientes húmedos, este helecho de frondas delicadas y verdes es ideal para decorar baños o zonas sombrías. Le encanta la humedad y los suelos bien drenados.",
                "familia": "Polypodiaceae",
                "id_espacios": espacios[0],
                "foto": os.path.join(base_dir, "planta.jpg")
            },
            {
                "nombre_cientifico": "Areca Palma",
                "alias": "Palmita",
                "descripcion": "Con su elegante forma y sus delgadas hojas arqueadas, esta palma aporta un toque tropical a cualquier espacio. Requiere bastante luz y un ambiente cálido.",
                "familia": "Arecaceae",
                "id_espacios": espacios[0],
                "foto": os.path.join(base_dir, "planta.jpg")
            },
            {
                "nombre_cientifico": "Cactus Mini",
                "alias": "Pinchudo",
                "descripcion": "Este pequeño cactus es ideal para escritorios o estanterías. Requiere muy poca agua y tolera bien la luz directa, siendo una opción excelente para principiantes.",
                "familia": "Cactaceae",
                "id_espacios": espacios[0],
                "foto": os.path.join(base_dir, "planta.jpg")
            },

            # Espacio 1 - 3 plantas con foto
            {
                "nombre_cientifico": "Lavanda Real",
                "alias": "Aromita",
                "descripcion": "Sus flores violetas desprenden un aroma relajante que la hace perfecta para jardines aromáticos. Necesita sol pleno y riego moderado para prosperar.",
                "familia": "Lamiaceae",
                "id_espacios": espacios[1],
                "foto": os.path.join(base_dir, "planta.jpg")
            },
            {
                "nombre_cientifico": "Menta Verde",
                "alias": "Refrescante",
                "descripcion": "Con un aroma fresco y sabor intenso, esta planta es ideal para cocinar o preparar infusiones. Requiere buena humedad y exposición a la luz solar indirecta.",
                "familia": "Lamiaceae",
                "id_espacios": espacios[1],
                "foto": os.path.join(base_dir, "planta.jpg")
            },
            {
                "nombre_cientifico": "Aloe Vera",
                "alias": "Sábila",
                "descripcion": "Muy apreciada por sus propiedades medicinales y estéticas. Requiere luz intensa y riegos esporádicos, siendo muy resistente a la sequía.",
                "familia": "Asphodelaceae",
                "id_espacios": espacios[1],
                "foto": os.path.join(base_dir, "planta.jpg")
            },

            # Espacio 2 - 6 plantas sin foto
            {
                "nombre_cientifico": "Bambú de la Suerte",
                "alias": "Lucky",
                "descripcion": "Una planta decorativa muy popular en espacios modernos. Se cree que atrae la buena suerte y la prosperidad. Fácil de cuidar, crece bien en agua o tierra.",
                "familia": "Dracaenaceae",
                "id_espacios": espacios[2],
                "foto": None
            },
            {
                "nombre_cientifico": "Begonia Rosa",
                "alias": "Rosita",
                "descripcion": "Sus llamativas flores rosadas alegran cualquier rincón del hogar. Prefiere sombra parcial y suelos húmedos pero bien drenados.",
                "familia": "Begoniaceae",
                "id_espacios": espacios[2],
                "foto": None
            },
            {
                "nombre_cientifico": "Petunia Blanca",
                "alias": "Nube",
                "descripcion": "Las petunias blancas son perfectas para macetas colgantes o bordes de jardín. Florecen durante gran parte del año y requieren bastante sol.",
                "familia": "Solanaceae",
                "id_espacios": espacios[2],
                "foto": None
            },
            {
                "nombre_cientifico": "Girasol Enano",
                "alias": "Solecito",
                "descripcion": "Este girasol compacto es ideal para balcones. Sus flores siguen el sol durante el día, y su color amarillo brillante alegra cualquier entorno.",
                "familia": "Asteraceae",
                "id_espacios": espacios[2],
                "foto": None
            },
            {
                "nombre_cientifico": "Caléndula",
                "alias": "Sol de jardín",
                "descripcion": "Conocida por sus propiedades medicinales, esta planta florece en tonos cálidos y requiere sol pleno y un riego regular.",
                "familia": "Asteraceae",
                "id_espacios": espacios[2],
                "foto": None
            },
            {
                "nombre_cientifico": "Helecho Macho",
                "alias": "Selvático",
                "descripcion": "Este helecho resistente y frondoso es ideal para patios sombreados. Necesita humedad constante y ambientes frescos.",
                "familia": "Dryopteridaceae",
                "id_espacios": espacios[2],
                "foto": None
            },
        ]

        relaciones = []  # acumulará PlantasEspacios
        for data in plantas_data:
            foto_path = data.pop("foto")              # quitamos foto del dict
            espacio_rel = data.pop("id_espacios")     # quitamos el espacio (para la intermedia)

            # Construimos Planta sin el campo id_espacios
            planta = Planta(**data)
            # Guardamos y cargamos foto si aplica
            if foto_path:
                with open(foto_path, "rb") as img_file:
                    planta.foto.save(os.path.basename(foto_path), File(img_file), save=True)
            else:
                planta.save()

            # Creamos la relación en tabla intermedia (cantidad por defecto = 1)
            relaciones.append(
                PlantasEspacios(
                    id_Planta=planta,
                    id_espacio=espacio_rel,
                    cantidad=1
                )
            )

        # Insertamos de golpe las relaciones
        if relaciones:
            PlantasEspacios.objects.bulk_create(relaciones)

        self.stdout.write(self.style.SUCCESS("Plantas creadas y relaciones en plantas_espacios insertadas correctamente."))

        # Obtén referencias por nombre (no dependen ya de id_espacios en Planta)
        ficus_lindo = Planta.objects.get(nombre_cientifico="Ficus Lindo")
        lavanda_real = Planta.objects.get(nombre_cientifico="Lavanda Real")
        aloe_vera   = Planta.objects.get(nombre_cientifico="Aloe Vera")

        # Espacios directos (ya no a través de planta.id_espacios)
        patio    = espacios[0]
        encinal  = espacios[1]
        interior = espacios[2]

        # --- ESPECIES ---
        especies_data = [
            {
                "nombre_cientifico": "Ficus lyrata",
                "alias": "Higuera",
                "descripcion": "Árbol ornamental tropical",
                "origen": "África Occidental",
                "foto": os.path.join(base_dir, "especie1.jpg"),
                "id_Planta": ficus_lindo
            },
            {
                "nombre_cientifico": "Lavandula angustifolia",
                "alias": "Lavanda",
                "descripcion": "Planta aromática",
                "origen": "Mediterráneo",
                "foto": os.path.join(base_dir, "especie2.jpg"),
                "id_Planta": lavanda_real
            },
            {
                "nombre_cientifico": "Aloe vera",
                "alias": "Sábila",
                "descripcion": "Planta medicinal",
                "origen": "Arabia",
                "foto": os.path.join(base_dir, "especie3.jpg"),
                "id_Planta": aloe_vera
            },
        ]
        especies = []
        for data in especies_data:
            foto_path = data.pop("foto")
            especie = Especie(**data)
            with open(foto_path, "rb") as img_file:
                especie.foto.save(os.path.basename(foto_path), File(img_file), save=True)
            especies.append(especie)

        self.stdout.write(self.style.SUCCESS("Especies creadas con imágenes."))

        # --- DATOS DE MONITOREO (RAW SQL) ---
        with transaction.atomic():
            first_space_id = espacios[0].pk
            first_plant_id = ficus_lindo.pk

            with connection.cursor() as cursor:
                # Circuito
                cursor.execute(
                    "INSERT INTO bd_ipc.tipoCircuitos (descripcion) VALuES (%s)",
                    ["Ambiental"]
                )
                tipocircuito_id = cursor.lastrowid

                cursor.execute(
                    "INSERT INTO bd_ipc.circuito (bluetooth, tipo_circuito, id_espacios) VALUES (%s, %s, %s)",
                    ["BT001-MAIN", tipocircuito_id ,first_space_id]
                )
                circuito_id = cursor.lastrowid

                cursor.execute(
                    """INSERT INTO sensadoambiental
                    (FechaSensado, TempAmbiental, Humedad, Lux, Radiacion,
                     id_Circuito, id_EnergiaPlanta, Luz_Azul, Luz_Blanca, Luz_Roja)
                    VALUES (NOW(), %s, %s, %s, %s, %s, NULL, %s, %s, %s)""",
                    [26.5, 45.2, 300.0, 520.0, circuito_id, 50.0, 100.0, 75.0]
                )
                cursor.execute(
                    """INSERT INTO sensadoambiental
                    (FechaSensado, TempAmbiental, Humedad, Lux, Radiacion,
                     id_Circuito, id_EnergiaPlanta, Luz_Azul, Luz_Blanca, Luz_Roja)
                    VALUES (NOW(), %s, %s, %s, %s, %s, NULL, %s, %s, %s)""",
                    [25.5, 60.2, 320.5, 0.75, circuito_id, 12.5, 18.7, 7.9]
                )

                # Ubicaciones
                cursor.execute(
                    "INSERT INTO bd_ipc.ubicaciones (CP, Estado, Municipio, Colonia) VALUES (%s, %s, %s, %s)",
                    [12345, 'EstadoTest', 'MunicipioTest', 'ColoniaTest']
                )

                # Suelo
                cursor.execute(
                    "INSERT INTO bd_ipc.suelo (CP, Nombre_Cientifico, Descripcion) VALUES (%s, %s, %s)",
                    [12345, 'Suelo test', 'Suelo para pruebas']
                )
                suelo_id = cursor.lastrowid

                # Etapa de desarrollo
                cursor.execute(
                    "INSERT INTO bd_ipc.etapadesarrollo (Nombre_Cientifico, Alias) VALUES (%s, %s)",
                    ['Etapa Inicial', 'Inicio']
                )
                etapa_id = cursor.lastrowid

                # Origen crianza
                cursor.execute(
                    "INSERT INTO bd_ipc.origencrianzaplanta (Nombre, Descripcion) VALUES (%s, %s)",
                    ['Cultivo local', 'Criada en vivero local para prueba']
                )
                origen_id = cursor.lastrowid

                # Plagas
                cursor.execute(
                    "INSERT INTO bd_ipc.plagas (Nombre_Cientifico, Alias, Descripcion, Tratamiento) VALUES (%s, %s, %s, %s)",
                    ['Plaga testica', 'Testín', 'Plaga común de prueba', 'Agua con jabón']
                )
                plaga_id = cursor.lastrowid

                # Planta individuo
                cursor.execute(
                    """INSERT INTO bd_ipc.plantaindividuo
                    (id_Suelo, id_Planta, id_Etapa, id_OrigenCrianza, plagas_id_Plaga, id_espacios)
                    VALUES (%s, %s, %s, %s, %s, %s)""",
                    [suelo_id, first_plant_id, etapa_id, origen_id, plaga_id, first_space_id]
                )

                # Material
                cursor.execute(
                    "INSERT INTO bd_ipc.material (Nombre, Descripcion) VALUES (%s, %s)",
                    ['Acero inoxidable', 'Material conductor para pruebas']
                )
                material_id = cursor.lastrowid

                # Electrodos
                cursor.execute(
                    "INSERT INTO bd_ipc.electrodos (id_Material, Forma, Largo, Ancho, Calibre_Cable) VALUES (%s, %s, %s, %s, %s)",
                    [material_id, 'Cilíndrica', '10cm', '0.5cm', '22AWG']
                )
                electrodos_id = cursor.lastrowid

                # Sensado Suelo
                cursor.execute(
                    """INSERT INTO bd_ipc.sensadoSuelo
                    (id_Circuito, fechaSensado, Voltaje, Amperaje, id_Electrodos, id_Suelo, PhSuelo, HumedadSuelo, id_PlantaIndividuo)
                    VALUES (%s, NOW(), %s, %s, %s, %s, %s, %s, %s)""",
                    [circuito_id, 3.15, 0.045, electrodos_id, suelo_id, '6.7', 38.5, 1]
                )

                # Sensado contaminantes
                cursor.execute(
                    """INSERT INTO bd_ipc.sensadocontaminantes
                    (id_Circuito, fechaSensado, CO, CO2, O, COVs)
                    VALUES (%s, NOW(), %s, %s, %s, %s)""",
                    [circuito_id, 1.25, 410.00, 20.50, 0.98]
                )

        self.stdout.write(self.style.SUCCESS("Datos para monitoreo insertados correctamente."))

        # --- EXPERIMENTOS (ORM) ---
        tipos_data = [
            {"nombre": "Proximidad",  "descripcion": "La persona se acerca a la planta"},
            {"nombre": "Tocar con un dedo", "descripcion": "Tocar con un dedo"},
            {"nombre": "Tocar con dos dedos", "descripcion": "Tocar con dos dedos"},
            {"nombre": "Apachurrar", "descripcion": "Presionar con dos dedos"},
            {"nombre": "Plagas", "descripcion": "Estimulación con plaga"},
        ]
        TipoEstimulacion.objects.bulk_create([TipoEstimulacion(**d) for d in tipos_data])

        mat_oro = Material.objects.create(nombre="Oro", descripcion="Oro")
        mat_cobre = Material.objects.create(nombre="Cobre", descripcion="Conductividad excelente, maleable")

        Electrodos.objects.bulk_create([
            Electrodos(id_material=mat_oro, forma="Circilar", largo="20mm", ancho="10mm", calibre_cable="24 AWG"),
            Electrodos(id_material=mat_cobre, forma="Circular", largo="15mm", ancho="2mm", calibre_cable="26 AWG"),
        ])

        ub1 = Ubicaciones.objects.create(cp="4000",  estado="CDMX",   municipio="Coyoacán", colonia="Del Carmen")
        ub2 = Ubicaciones.objects.create(cp="52779", estado="Edomex", municipio="Naucalpan", colonia="Satélite")

        suelo_arcilloso = Suelo.objects.create(cp=ub1, nombre_cientifico="Suelo arcilloso", descripcion="Alto contenido de arcilla")
        suelo_arenoso  = Suelo.objects.create(cp=ub2, nombre_cientifico="Suelo arenoso",  descripcion="Drenaje rápido, nutrientes bajos")

        et_semilla = EtapaDesarrollo.objects.create(nombre_cientifico="Germinación", alias="Semilla")
        et_juvenil = EtapaDesarrollo.objects.create(nombre_cientifico="Juvenil",     alias="Plántula")
        et_adulta  = EtapaDesarrollo.objects.create(nombre_cientifico="Adulta",      alias="Madura")

        origen_vivero = OrigenCrianza.objects.create(nombre="Vivero",        descripcion="Adquirida en vivero")
        origen_semilla = OrigenCrianza.objects.create(nombre="Semilla propia", descripcion="Germinada localmente")

        pl_cochinilla = Plagas.objects.create(
            nombre_cientifico="Pseudococcidae spp.",
            alias="Cochinilla algodonosa",
            descripcion="Manchas blancas algodonosas en tallos",
            tratamiento="Jabón potásico, aceite de neem"
        )
        pl_pulgon = Plagas.objects.create(
            nombre_cientifico="Aphididae spp.",
            alias="Pulgón",
            descripcion="Enrosque de hojas por succión de savia",
            tratamiento="Ajo-macero, control biológico con catarinitas"
        )

        PlantaIndividuo.objects.bulk_create([
            PlantaIndividuo(
                id_suelo=suelo_arcilloso,
                id_planta=ficus_lindo,
                id_etapa=et_juvenil,
                id_OrigenCrianza=origen_vivero,
                plagas_id_Plaga=pl_cochinilla,
                id_espacios=patio
            ),
            PlantaIndividuo(
                id_suelo=suelo_arenoso,
                id_planta=lavanda_real,
                id_etapa=et_adulta,
                id_OrigenCrianza=origen_semilla,
                plagas_id_Plaga=pl_pulgon,
                id_espacios=encinal
            ),
            PlantaIndividuo(
                id_suelo=suelo_arenoso,
                id_planta=aloe_vera,
                id_etapa=et_juvenil,
                id_OrigenCrianza=origen_vivero,
                plagas_id_Plaga=pl_pulgon,
                id_espacios=interior
            ),
        ])

        self.stdout.write(self.style.SUCCESS("Datos de experimentos creados correctamente."))
