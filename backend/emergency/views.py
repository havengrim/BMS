from rest_framework import viewsets, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from .models import EmergencyReport
from .serializers import EmergencyReportSerializer, EmergencyReportPublicSerializer

class EmergencyReportViewSet(viewsets.ModelViewSet):
    queryset = EmergencyReport.objects.all().order_by('-submitted_at')
    parser_classes = (MultiPartParser, FormParser)  # required for file uploads

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_serializer_class(self):
        if self.action == "create":
            return EmergencyReportSerializer  # ensure FileField is used
        user = self.request.user
        if user.is_authenticated and getattr(user, 'role', None) == "resident":
            return EmergencyReportSerializer
        return EmergencyReportPublicSerializer

    def get_queryset(self):
        if not self.request.user.is_authenticated:
            return EmergencyReport.objects.none()
        return super().get_queryset()
