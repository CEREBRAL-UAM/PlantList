from rest_framework.permissions import BasePermission

class IsProjectMemberOrAdmin(BasePermission):
    def has_permission(self, request, view):
        user = getattr(request, "user", None)
        if not user:
            return False
        if hasattr(user, "is_authenticated") and user.is_authenticated is False:
            return False
        return True
