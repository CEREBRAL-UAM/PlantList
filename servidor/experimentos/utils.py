import random
import string
from datetime import datetime

def generar_codigo_video(hora_inicio, hora_fin):
    inicio = hora_inicio.strftime("%Y%m%d-%H%M%S")
    fin = hora_fin.strftime("%H%M%S")
    letras = ''.join(random.choices(string.ascii_uppercase + string.digits, k=3))
    return f"VID-{inicio}-{fin}-{letras}"
