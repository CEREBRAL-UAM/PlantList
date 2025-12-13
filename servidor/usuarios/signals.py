import os
from django.db.models.signals import pre_save, post_delete
from django.dispatch import receiver
from .models import Usuario

def delete_file(ruta):
    if ruta and os.path.isfile(ruta):
        try:
            os.remove(ruta)
        except Exception as e:
            print(f"No se pudo eliminar archivo: {ruta} - {e}")

@receiver(post_delete, sender=Usuario)
def eliminar_foto_usuario(sender, instance, **kwargs):
    if instance.foto:
        delete_file(instance.foto.path)

@receiver(pre_save, sender=Usuario)
def reemplazar_foto_planta(sender, instance, **kwargs):
    try:
        old = Usuario.objects.get(pk=instance.pk)
        if old.foto and instance.foto and old.foto != instance.foto:
            delete_file(old.foto.path)
    except Usuario.DoesNotExist:
        pass  # Nuevo objeto, no hay imagen anterior