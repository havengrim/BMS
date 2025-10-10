# views.py
from rest_framework import viewsets
from .models import EmergencyReport
from .serializers import (
    EmergencyReportSerializer,
    EmergencyReportPublicSerializer
)

class EmergencyReportViewSet(viewsets.ModelViewSet):
    queryset = EmergencyReport.objects.all().order_by('-submitted_at')

    def get_serializer_class(self):
        user = self.request.user
        if user.is_authenticated and getattr(user, 'role', None) == "resident":
            # Residents get the public serializer
            return EmergencyReportPublicSerializer
        # Everyone else (admin, staff, etc.) gets the full serializer
        return EmergencyReportSerializer