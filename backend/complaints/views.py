from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from .models import Complaint, ComplaintEvidence
from .serializers import ComplaintSerializer
import uuid

# Helper to generate unique reference number
def generate_unique_reference_number():
    while True:
        ref = f"REF-{uuid.uuid4().hex[:8].upper()}"
        if not Complaint.objects.filter(reference_number=ref).exists():
            return ref

# Create a complaint
class ComplaintCreateView(generics.CreateAPIView):
    queryset = Complaint.objects.all()
    serializer_class = ComplaintSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        reference_number = generate_unique_reference_number()
        complaint = serializer.save(user=self.request.user, reference_number=reference_number)
        
        files = self.request.FILES.getlist('evidence', [])
        for file in files:
            ComplaintEvidence.objects.create(complaint=complaint, file=file)

# List complaints of the authenticated user
class ComplaintListByUserView(generics.ListAPIView):
    serializer_class = ComplaintSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Complaint.objects.filter(user=self.request.user).order_by('-date_filed')

# Retrieve a specific complaint by ID
class ComplaintDetailView(generics.RetrieveAPIView):
    queryset = Complaint.objects.all()
    serializer_class = ComplaintSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'

    def get_object(self):
        obj = super().get_object()
        if obj.user != self.request.user:
            raise PermissionDenied("You do not have permission to view this complaint.")
        return obj

# Update an existing complaint
class ComplaintUpdateView(generics.UpdateAPIView):
    queryset = Complaint.objects.all()
    serializer_class = ComplaintSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'

    def get_object(self):
        obj = super().get_object()
        if obj.user != self.request.user:
            raise PermissionDenied("You do not have permission to update this complaint.")
        return obj

    def perform_update(self, serializer):
        complaint = serializer.save()
        files = self.request.FILES.getlist('evidence', [])
        for file in files:
            ComplaintEvidence.objects.create(complaint=complaint, file=file)
        return complaint

# Delete a complaint and its associated evidence
class ComplaintDeleteView(generics.DestroyAPIView):
    queryset = Complaint.objects.all()
    serializer_class = ComplaintSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'

    def get_object(self):
        obj = super().get_object()
        if obj.user != self.request.user:
            raise PermissionDenied("You do not have permission to delete this complaint.")
        return obj

    def perform_destroy(self, instance):
        for evidence in instance.evidence.all():
            evidence.file.delete(save=False)
            evidence.delete()
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
