from rest_framework import serializers
from .models import EmergencyAlert, EmergencyReport

class EmergencyReportSerializer(serializers.ModelSerializer):
    media_file = serializers.FileField(required=True)  # Explicit FileField for upload handling
    latitude = serializers.FloatField()  # Explicit to handle string -> float conversion
    longitude = serializers.FloatField()  # Explicit to handle string -> float conversion

    class Meta:
        model = EmergencyReport
        fields = '__all__'

class EmergencyReportPublicSerializer(serializers.ModelSerializer):
    alert_message = serializers.SerializerMethodField()
    media_url = serializers.SerializerMethodField()  # <-- already declared

    INCIDENT_ALERTS = {
        "medical": "Medical emergency reported. Seek help immediately.",
        "security": "Security incident reported. Stay alert and safe.",
        "fire": "Fire reported. Evacuate if necessary.",
        "flood": "Flood reported. Move to higher ground.",
        "earthquake": "Earthquake reported. Follow safety procedures.",
        "other": "Emergency reported. Stay alert.",
    }

    class Meta:
        model = EmergencyReport
        fields = [
            'id',
            'incident_type',
            'location_text',
            'submitted_at',
            'alert_message',
            'media_file',
            'media_url',  # <-- add this
        ]

    def get_alert_message(self, obj):
        return self.INCIDENT_ALERTS.get(obj.incident_type.lower(), "Emergency reported. Stay alert.")

    def get_media_url(self, obj):
        request = self.context.get('request')  # needed to build absolute URL
        if obj.media_file:
            return request.build_absolute_uri(obj.media_file.url) if request else obj.media_file.url
        return None