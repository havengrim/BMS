from rest_framework import serializers
from .models import EmergencyAlert, EmergencyReport

class EmergencyReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmergencyReport
        fields = '__all__'


class EmergencyReportPublicSerializer(serializers.ModelSerializer):
    alert_message = serializers.SerializerMethodField()

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
        fields = ['id', 'incident_type', 'location_text', 'submitted_at', 'alert_message']

    def get_alert_message(self, obj):
        return self.INCIDENT_ALERTS.get(obj.incident_type.lower(), "Emergency reported. Stay alert.")
