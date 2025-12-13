import os
from django.db.models.signals import pre_save, post_delete
from django.dispatch import receiver
from .models import Planta, Especie, Espacio

def delete_file(ruta):
    if ruta and os.path.isfile(ruta):
        try:
            os.remove(ruta)
        except Exception as e:
            print(f"No se pudo eliminar archivo: {ruta} - {e}")


@receiver(post_delete, sender=Planta)
def eliminar_foto_planta(sender, instance, **kwargs):
    if instance.foto:
        delete_file(instance.foto.path)

@receiver(pre_save, sender=Planta)
def reemplazar_foto_planta(sender, instance, **kwargs):
    try:
        old = Planta.objects.get(pk=instance.pk)
        if old.foto and instance.foto and old.foto != instance.foto:
            delete_file(old.foto.path)
    except Planta.DoesNotExist:
        pass  # Nuevo objeto, no hay imagen anterior



@receiver(post_delete, sender=Especie)
def eliminar_foto_especie(sender, instance, **kwargs):
    if instance.foto:
        delete_file(instance.foto.path)

@receiver(pre_save, sender=Especie)
def reemplazar_foto_especie(sender, instance, **kwargs):
    try:
        old = Especie.objects.get(pk=instance.pk)
        if old.foto and instance.foto and old.foto != instance.foto:
            delete_file(old.foto.path)
    except Especie.DoesNotExist:
        pass


@receiver(post_delete, sender=Espacio)
def eliminar_foto_espacio(sender, instance, **kwargs):
    if instance.foto:
        delete_file(instance.foto.path)

@receiver(pre_save, sender=Espacio)
def reemplazar_foto_espacio(sender, instance, **kwargs):
    try:
        old = Espacio.objects.get(pk=instance.pk)
        if old.foto and instance.foto and old.foto != instance.foto:
            delete_file(old.foto.path)
    except Espacio.DoesNotExist:
        pass
