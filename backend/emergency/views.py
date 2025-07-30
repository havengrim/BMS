from rest_framework import viewsets, permissions
from .models import EmergencyReport, EmergencyFeedback
from .serializers import EmergencyReportSerializer, EmergencyFeedbackSerializer

class EmergencyReportViewSet(viewsets.ModelViewSet):
    queryset = EmergencyReport.objects.all().order_by('-submitted_at')
    serializer_class = EmergencyReportSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(reporter=self.request.user)
        else:
            serializer.save()  


class EmergencyFeedbackViewSet(viewsets.ModelViewSet):
    queryset = EmergencyFeedback.objects.all().order_by('-submitted_at')
    serializer_class = EmergencyFeedbackSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
