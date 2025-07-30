from rest_framework import serializers
from .models import Complaint, ComplaintEvidence

class ComplaintEvidenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComplaintEvidence
        fields = ['id', 'file']

class ComplaintSerializer(serializers.ModelSerializer):
    evidence = ComplaintEvidenceSerializer(many=True, read_only=True)

    class Meta:
        model = Complaint
        fields = '__all__'
