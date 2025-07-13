from rest_framework import viewsets
from .models import SensadoAmbiental
from .serializers import SensadoAmbientalSerializer

class SensadoAmbientalViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SensadoAmbiental.objects.all().order_by('-FechaSensado')[:100]
    serializer_class = SensadoAmbientalSerializer
