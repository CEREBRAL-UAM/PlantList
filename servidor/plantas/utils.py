import random 
import string 
from .models import Espacio

def generar_clave(): 
    clave = string.ascii_uppercase + string.digits
    return ''.join(random.choices(clave, k=6))

def generar_clave_acceso_unica(): 
    while True: 
        clave = generar_clave()
        if not Espacio.objects.filter(clave_acceso=clave).exists():
            return clave