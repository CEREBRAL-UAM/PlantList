from rest_framework.permissions import BasePermission

class Permisos(BasePermission):
    def has_permission(self, request, view):
        user = getattr(request, 'user', None)
        if not user:
            return False
        tipo = getattr(user, 'TipoUsuario', None)
        return tipo in ('isAdmin', 'isParticipant')
