from rest_framework import viewsets, permissions
from .models import BlotterReport
from .serializers import BlotterReportSerializer
from rest_framework.permissions import AllowAny  # Add this if not yet imported

class BlotterReportViewSet(viewsets.ModelViewSet):
    queryset = BlotterReport.objects.all().order_by('-created_at')
    serializer_class = BlotterReportSerializer
    permission_classes = [AllowAny]  # You can change to IsAuthenticated if needed
