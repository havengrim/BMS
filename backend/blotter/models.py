from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class BlotterReport(models.Model):
    STATUS_CHOICES = [
        ('filed', 'Filed'),
        ('under_investigation', 'Under Investigation'),
        ('resolved', 'Resolved'),
        ('dismissed', 'Dismissed'),
    ]

    REPORT_TYPE_CHOICES = [
        ('complaint', 'Complaint'),
        ('incident', 'Incident'),
        ('mediation', 'Mediation'),
    ]

    report_number = models.AutoField(primary_key=True)
    filed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='blotter_filed')
    complainant_name = models.CharField(max_length=255)
    respondent_name = models.CharField(max_length=255)
    incident_type = models.CharField(max_length=100, choices=REPORT_TYPE_CHOICES)
    incident_date = models.DateField()
    incident_time = models.TimeField()
    location = models.CharField(max_length=255)
    statement = models.TextField()
    evidence = models.FileField(upload_to='blotter_evidence/', blank=True, null=True)

    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='filed')
    resolution_notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Blotter #{self.report_number} - {self.complainant_name} vs {self.respondent_name}"
