from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Complaint, ComplaintEvidence
from .serializers import ComplaintSerializer

class ComplaintListCreateView(generics.ListCreateAPIView):
    queryset = Complaint.objects.all()
    serializer_class = ComplaintSerializer
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            complaint = serializer.save()

            # Handle evidence files
            for file in request.FILES.getlist('evidence'):
                ComplaintEvidence.objects.create(complaint=complaint, file=file)

            return Response(ComplaintSerializer(complaint).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ComplaintDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Complaint.objects.all()
    serializer_class = ComplaintSerializer
    lookup_field = 'id'
