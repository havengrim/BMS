from rest_framework import serializers
from .models import Complaint, ComplaintEvidence

class ComplaintEvidenceSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = ComplaintEvidence
        fields = ['id', 'file', 'file_url']

    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file and hasattr(obj.file, 'url'):
            return request.build_absolute_uri(obj.file.url)
        return None


class ComplaintSerializer(serializers.ModelSerializer):
    evidence = ComplaintEvidenceSerializer(many=True, read_only=True)
    location = serializers.SerializerMethodField()

    class Meta:
        model = Complaint
        fields = [
            'id', 'reference_number', 'type', 'fullname', 'contact_number', 'address',
            'email_address', 'subject', 'detailed_description', 'respondent_name',
            'respondent_address', 'latitude', 'longitude', 'date_filed', 'status',
            'priority', 'evidence', 'location'
        ]
        read_only_fields = [
            'id', 'reference_number', 'date_filed', 'status', 'priority', 'evidence', 'user'
        ]

    def get_location(self, obj):
        return {'lat': float(obj.latitude), 'lng': float(obj.longitude)}

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user if request and request.user.is_authenticated else None
        if not user:
            raise serializers.ValidationError("User must be authenticated to file a complaint.")
        
        # Extract and remove location data
        location = validated_data.pop('location', None)
        if location:
            validated_data['latitude'] = location.get('lat')
            validated_data['longitude'] = location.get('lng')

        # Avoid duplicate user argument
        validated_data.pop('user', None)

        # Create complaint
        complaint = Complaint.objects.create(user=user, **validated_data)

        # Handle file uploads
        files = request.FILES.getlist('evidence', [])
        for file in files:
            ComplaintEvidence.objects.create(complaint=complaint, file=file)

        return complaint
