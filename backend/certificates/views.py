from rest_framework import generics, permissions
from .models import CertificateRequest, BusinessPermit
from .serializers import CertificateRequestSerializer, BusinessPermitSerializer

class CertificateRequestListView(generics.ListAPIView):
    serializer_class = CertificateRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only return requests for the logged-in user
        return CertificateRequest.objects.filter(user=self.request.user)

class CertificateRequestCreateView(generics.CreateAPIView):
    serializer_class = CertificateRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Automatically set the logged-in user
        serializer.save(user=self.request.user)

class CertificateRequestDetailView(generics.RetrieveAPIView):
    serializer_class = CertificateRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        # User can only retrieve their own requests
        return CertificateRequest.objects.filter(user=self.request.user)

class CertificateRequestUpdateView(generics.UpdateAPIView):
    serializer_class = CertificateRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        # User can only update their own requests
        return CertificateRequest.objects.filter(user=self.request.user)

class CertificateRequestDeleteView(generics.DestroyAPIView):
    serializer_class = CertificateRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        # User can only delete their own requests
        return CertificateRequest.objects.filter(user=self.request.user)

class BusinessPermitListCreateView(generics.ListCreateAPIView):
    queryset = BusinessPermit.objects.all()
    serializer_class = BusinessPermitSerializer
    permission_classes = [permissions.IsAuthenticated]

class BusinessPermitRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = BusinessPermit.objects.all()
    serializer_class = BusinessPermitSerializer
    permission_classes = [permissions.IsAuthenticated]
