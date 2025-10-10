from rest_framework import serializers
from .models import CertificateRequest, BusinessPermit

class CertificateRequestSerializer(serializers.ModelSerializer):
    user_age = serializers.SerializerMethodField(read_only=True)
    user_birthdate = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = CertificateRequest
        fields = [
            'id', 'certificate_type', 'request_number', 'first_name', 'last_name',
            'middle_name', 'complete_address', 'houseNum', 'contact_number',
            'email_address', 'purpose', 'agree_terms', 'status', 'created_at',
            'user', 'user_age', 'user_birthdate',
            'business_name',  # ✅ added field
        ]
        read_only_fields = [
            'id', 'request_number', 'created_at', 'user', 'user_age', 'user_birthdate'
        ]

    def get_user_age(self, obj):
        return obj.user_age()

    def get_user_birthdate(self, obj):
        birthdate = obj.user.profile.birthdate if obj.user and hasattr(obj.user, 'profile') else None
        return birthdate.isoformat() if birthdate else None

    def validate(self, data):
        # ✅ Ensure terms are agreed
        if not data.get('agree_terms'):
            raise serializers.ValidationError({
                "agree_terms": "You must agree to the terms and conditions."
            })

        # ✅ Require business_name only if certificate_type == "Business Clearance"
        if data.get("certificate_type") == "Business Clearance" and not data.get("business_name"):
            raise serializers.ValidationError({
                "business_name": "Business name is required for Business Clearance."
            })

        return data


class BusinessPermitSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessPermit
        fields = [
            'id', 'business_name', 'business_type', 'owner_name', 'business_address',
            'contact_number', 'owner_address', 'houseNum', 'business_description',
            'is_renewal', 'status', 'created_at', 'updated_at', 'user'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'user']
