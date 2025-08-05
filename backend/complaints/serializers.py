from rest_framework import serializers
from .models import Complaint

class ComplaintSerializer(serializers.ModelSerializer):
    evidence = serializers.SerializerMethodField()  # Rename evidence_url to evidence
    location = serializers.SerializerMethodField()

    class Meta:
        model = Complaint
        fields = [
            'id', 'reference_number', 'type', 'fullname', 'contact_number', 'address',
            'email_address', 'subject', 'detailed_description', 'respondent_name',
            'respondent_address', 'latitude', 'longitude', 'date_filed', 'status',
            'priority', 'evidence', 'location'  # Remove evidence_url, keep evidence
        ]
        read_only_fields = [
            'id', 'reference_number', 'date_filed', 'status', 'priority', 'user'
        ]

    def get_evidence(self, obj):
        request = self.context.get('request')
        if obj.evidence and hasattr(obj.evidence, 'url'):
            return {'file_url': request.build_absolute_uri(obj.evidence.url)}
        return None

    def get_location(self, obj):
        return {'lat': float(obj.latitude), 'lng': float(obj.longitude)}

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user if request and request.user.is_authenticated else None
        if not user:
            raise serializers.ValidationError("User must be authenticated to file a complaint.")

        # Extract and remove location data if present
        location = validated_data.pop('location', None)
        if location:
            validated_data['latitude'] = location.get('lat')
            validated_data['longitude'] = location.get('lng')

        # Remove user if accidentally included
        validated_data.pop('user', None)

        # Get file from request.FILES
        evidence_file = request.FILES.get('evidence')
        complaint = Complaint.objects.create(user=user, **validated_data)

        if evidence_file:
            complaint.evidence = evidence_file
            complaint.save(update_fields=['evidence'])

        return complaint