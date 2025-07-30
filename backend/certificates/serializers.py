from rest_framework import serializers
from .models import CertificateRequest, BusinessPermit

class CertificateRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = CertificateRequest
        fields = '__all__'
        read_only_fields = ['request_number', 'created_at']

class BusinessPermitSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessPermit
        fields = [
            'id',
            'business_name',
            'business_type',
            'owner_name',
            'business_address',
            'contact_number',
            'owner_address',
            'business_description',
            'is_renewal',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']