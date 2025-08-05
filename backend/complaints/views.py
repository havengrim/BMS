from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from .models import Complaint
from .serializers import ComplaintSerializer
import uuid

def generate_unique_reference_number():
    while True:
        ref = f"REF-{uuid.uuid4().hex[:8].upper()}"
        if not Complaint.objects.filter(reference_number=ref).exists():
            return ref

class ComplaintCreateView(generics.CreateAPIView):
    queryset = Complaint.objects.all()
    serializer_class = ComplaintSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        reference_number = generate_unique_reference_number()
        complaint = serializer.save(user=self.request.user, reference_number=reference_number)

        evidence_file = self.request.FILES.get('evidence')
        if evidence_file:
            complaint.evidence = evidence_file
            complaint.save(update_fields=['evidence'])


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

class ComplaintUpdateView(generics.UpdateAPIView):
    queryset = Complaint.objects.all()
    serializer_class = ComplaintSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'

    def perform_update(self, serializer):
        complaint = serializer.save()
        evidence_file = self.request.FILES.get('evidence')
        if evidence_file:
            complaint.evidence = evidence_file
            complaint.save(update_fields=['evidence'])
        return complaint

class ComplaintDeleteView(generics.DestroyAPIView):
    queryset = Complaint.objects.all()
    serializer_class = ComplaintSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'

    def perform_destroy(self, instance):
        if instance.evidence:
            instance.evidence.delete(save=False)
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class ComplaintListView(generics.ListAPIView):
    serializer_class = ComplaintSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Complaint.objects.all().order_by('-date_filed')
    
class ComplaintListByUserView(generics.ListAPIView):
    serializer_class = ComplaintSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Complaint.objects.filter(user=self.request.user).order_by('-date_filed')