# views.py
from rest_framework import viewsets
from .models import EmergencyReport
from .serializers import EmergencyReportSerializer

class EmergencyReportViewSet(viewsets.ModelViewSet):
    queryset = EmergencyReport.objects.all().order_by('-submitted_at')
    serializer_class = EmergencyReportSerializer
