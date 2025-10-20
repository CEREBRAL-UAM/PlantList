from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from usuarios.authentication import TokenAuthentication
from rest_framework.views import APIView
from usuarios.permisos import IsAdmin

class RolModelViewSet(ModelViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, IsAdmin]

class RolAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, IsAdmin]