from rest_framework import serializers
from .models import CertificateRequest, BusinessPermit

class CertificateRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = CertificateRequest
        fields = [
            'id', 'certificate_type', 'request_number', 'first_name', 'last_name',
            'middle_name', 'complete_address', 'contact_number', 'email_address',
            'purpose', 'agree_terms', 'status', 'created_at', 'user'
        ]
        read_only_fields = ['id', 'request_number', 'created_at', 'user']

    def validate(self, data):
        if not data.get('agree_terms'):
            raise serializers.ValidationError({"agree_terms": "You must agree to the terms and conditions."})
        return data

class BusinessPermitSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessPermit
        fields = [
            'id', 'business_name', 'business_type', 'owner_name', 'business_address',
            'contact_number', 'owner_address', 'business_description', 'is_renewal',
            'created_at', 'updated_at', 'user'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'user']