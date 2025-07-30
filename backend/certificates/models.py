from django.db import models
from django.utils import timezone

CERTIFICATE_TYPES = [
    ('BR', 'Barangay Clearance'),
    ('CR', 'Certificate of Residency'),
    ('CI', 'Certificate of Indigency'),
]

class CertificateRequest(models.Model):
    certificate_type = models.CharField(max_length=2, choices=CERTIFICATE_TYPES)
    request_number = models.CharField(max_length=20, unique=True, blank=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    middle_name = models.CharField(max_length=100, blank=True, null=True)
    complete_address = models.TextField()
    contact_number = models.CharField(max_length=20)
    email_address = models.EmailField()
    purpose = models.TextField()
    agree_terms = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)

    def save(self, *args, **kwargs):
        if not self.request_number:
            prefix = self.certificate_type
            last = CertificateRequest.objects.filter(certificate_type=self.certificate_type).count() + 1
            self.request_number = f"{prefix}-{last:03d}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.request_number} - {self.first_name} {self.last_name}"

class BusinessPermit(models.Model):
    business_name = models.CharField(max_length=255)
    business_type = models.CharField(max_length=100) 
    owner_name = models.CharField(max_length=255)
    business_address = models.TextField()
    contact_number = models.CharField(max_length=20)
    owner_address = models.TextField()
    business_description = models.TextField(blank=True)
    is_renewal = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.business_name