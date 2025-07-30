from django.db import models

class Complaint(models.Model):
    type = models.CharField(max_length=100)
    fullname = models.CharField(max_length=150)
    contact_number = models.CharField(max_length=20)
    address = models.TextField()
    email_address = models.EmailField()
    subject = models.CharField(max_length=200)
    detailed_description = models.TextField()
    
    respondent_name = models.CharField(max_length=150)
    respondent_address = models.TextField()

    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)

    date_filed = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.subject} by {self.fullname}"

class ComplaintEvidence(models.Model):
    complaint = models.ForeignKey(Complaint, on_delete=models.CASCADE, related_name='evidence')
    file = models.FileField(upload_to='complaint_evidence/')