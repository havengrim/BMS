from rest_framework import serializers
from .models import BlotterReport

class BlotterReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlotterReport
        fields = '__all__'
