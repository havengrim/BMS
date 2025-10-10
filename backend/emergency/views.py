# views.py
from rest_framework import viewsets, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from .models import EmergencyReport
from .serializers import EmergencyReportSerializer, EmergencyReportPublicSerializer

class EmergencyReportViewSet(viewsets.ModelViewSet):
    queryset = EmergencyReport.objects.all().order_by('-submitted_at')
    serializer_class = EmergencyReportSerializer
    parser_classes = (MultiPartParser, FormParser)  # Added: Essential for handling file uploads in multipart/form-data

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_serializer_class(self):
        user = self.request.user
        if user.is_authenticated and getattr(user, 'role', None) == "resident":
            return EmergencyReportSerializer
        return EmergencyReportPublicSerializer

    def get_queryset(self):
        if not self.request.user.is_authenticated:
            return EmergencyReport.objects.none()
        return super().get_queryset()