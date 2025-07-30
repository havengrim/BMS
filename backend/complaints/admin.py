from django.contrib import admin
from .models import Complaint, ComplaintEvidence
# Register your models here.

admin.site.register(Complaint)
admin.site.register(ComplaintEvidence)
