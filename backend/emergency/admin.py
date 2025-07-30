from django.contrib import admin
from .models import EmergencyFeedback, EmergencyReport
# Register your models here.

admin.site.register(EmergencyFeedback)
admin.site.register(EmergencyReport)
