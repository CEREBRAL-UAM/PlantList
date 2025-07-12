from django.core.management.base import BaseCommand
from plantas.utils import generar_clave_acceso_unica
from plantas.models import Espacio, Especie, Planta, EspaciosUsuarios
from usuarios.models import Usuario, TokenUsuario
from django.contrib.auth.hashers import make_password
from django.core.files import File
import uuid
import os

class Command(BaseCommand):
    help = 'Llena la base de datos con datos de prueba incluyendo fotos'

    def handle(self, *args, **options):
        base_dir = 'media/demo/'  

        # Borro la info de prueabs anteriores 
        Planta.objects.all().delete()
        Especie.objects.all().delete()
        Espacio.objects.all().delete()
        Usuario.objects.all().delete()
        TokenUsuario.objects.all().delete()

        # Usuario de prueba 
        usuario_demo = Usuario.objects.create(
            Nombre="Carlos",
            ApellidoPaterno="Pérez",
            ApellidoMaterno="López",
            Telefono="5551234567",
            CorreoElectronico="alguien@algo.com",
            Contrasenia=make_password("1234"),
        )

        foto_usuario = os.path.join(base_dir, "usuario.jpg")
        with open(foto_usuario, "rb") as img_file:
            usuario_demo.Foto.save("usuario.jpg", File(img_file), save=True)


        token = str(uuid.uuid4())
        TokenUsuario.objects.create(
            usuario = usuario_demo,
            token = token
        )

        self.stdout.write(self.style.SUCCESS("Usuario creado con exito ! \nToken: " +token))

        # Espacios
        espacios_data = [
            {"nombre_espacio": "Patio", "foto": os.path.join(base_dir, "espacio1.jpg"),"clave_acceso":generar_clave_acceso_unica()},
            {"nombre_espacio": "Encinal", "foto": os.path.join(base_dir, "espacio2.jpg"),"clave_acceso":generar_clave_acceso_unica()},
            {"nombre_espacio": "Interior", "foto": os.path.join(base_dir, "espacio3.jpg"),"clave_acceso":generar_clave_acceso_unica()},
        ]
        espacios = []
        for data in espacios_data:
            with open(data["foto"], "rb") as img_file:
                espacio = Espacio(nombre_espacio=data["nombre_espacio"], clave_acceso=data["clave_acceso"])
                espacio.foto.save(os.path.basename(data["foto"]), File(img_file), save=True)
                espacios.append(espacio)
                EspaciosUsuarios.objects.create(
                    id_usuario = usuario_demo,
                    id_espacios = espacio,
                    isAdmin = True
                )

        self.stdout.write(self.style.SUCCESS("Espacios creados con imágenes."))


        
        #Plantas
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


        for data in plantas_data:
            foto_path = data.pop("foto")  # Remueve la clave 'foto' del diccionario

            planta = Planta(**data)  # Crea la planta sin foto
            planta.save()  # Guarda primero para tener una instancia en BD

            if foto_path:  # Si hay foto, la abrimos y asignamos
                with open(foto_path, "rb") as img_file:
                    planta.foto.save(os.path.basename(foto_path), File(img_file), save=True)

        self.stdout.write(self.style.SUCCESS("Plantas creadas con y sin imágenes correctamente."))
        
        ficus_lindo = Planta.objects.get(nombre_cientifico="Ficus Lindo")
        lavanda_real = Planta.objects.get(nombre_cientifico="Lavanda Real")
        aloe_vera = Planta.objects.get(nombre_cientifico="Aloe Vera")

        # Especies
        especies_data = [
            {
                "nombre_cientifico": "Ficus lyrata",
                "alias": "Higuera",
                "descripcion": "Árbol ornamental tropical",
                "origen": "África Occidental",
                "foto": os.path.join(base_dir, "especie1.jpg"),
                "id_Planta" : ficus_lindo
            },
            {
                "nombre_cientifico": "Lavandula angustifolia",
                "alias": "Lavanda",
                "descripcion": "Planta aromática",
                "origen": "Mediterráneo",
                "foto": os.path.join(base_dir, "especie2.jpg"),
                "id_Planta" : lavanda_real
            },
            {
                "nombre_cientifico": "Aloe vera",
                "alias": "Sábila",
                "descripcion": "Planta medicinal",
                "origen": "Arabia",
                "foto": os.path.join(base_dir, "especie3.jpg"),
                "id_Planta" : aloe_vera
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

    