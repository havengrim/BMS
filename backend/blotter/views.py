from rest_framework import viewsets, permissions
from rest_framework.response import Response
from .models import BlotterReport
from .serializers import BlotterReportSerializer

class BlotterReportViewSet(viewsets.ModelViewSet):
    queryset = BlotterReport.objects.all().order_by('-created_at')
    serializer_class = BlotterReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(filed_by=self.request.user)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)
