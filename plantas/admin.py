from django.contrib import admin
from .models import (Planta, Especie, Enfermedad,
                      Plaga)

# Register your models here.
admin.site.register(Planta)
admin.site.register(Especie)
admin.site.register(Enfermedad)
admin.site.register(Plaga)