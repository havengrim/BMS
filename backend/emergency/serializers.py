from rest_framework import serializers
from .models import EmergencyReport, EmergencyFeedback

class EmergencyReportSerializer(serializers.ModelSerializer):
    reporter_username = serializers.CharField(source='reporter.username', read_only=True)

    class Meta:
        model = EmergencyReport
        fields = '__all__'
        read_only_fields = ['id', 'submitted_at', 'updated_at', 'reporter']


class EmergencyFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmergencyFeedback
        fields = '__all__'
        read_only_fields = ['id', 'submitted_at']
