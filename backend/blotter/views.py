from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from .models import BlotterReport
from .serializers import BlotterReportSerializer

class BlotterReportViewSet(viewsets.ModelViewSet):
    serializer_class = BlotterReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Filter to only the current user's blotters for list/retrieve/etc.
        # Admins can see all if you add IsAdminUser later
        return BlotterReport.objects.filter(filed_by=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(filed_by=self.request.user)

    def get_permissions(self):
        # Optional: Stricter permissions for sensitive actions
        if self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, self.OwnershipPermission]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    class OwnershipPermission(permissions.BasePermission):
        def has_object_permission(self, request, view, obj):
            # Only allow actions on own blotters
            return obj.filed_by == request.user

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