from django.contrib.auth.models import User
from django.db import models

class Profile(models.Model):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('staff', 'Staff'),
        ('user', 'User'),
    ]

    name = models.CharField(max_length=255, default='Unknown')
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    contact_number = models.CharField(max_length=20)
    address = models.CharField(max_length=255)
    civil_status = models.CharField(max_length=100)
    birthdate = models.DateField()
    image = models.ImageField(upload_to='profile_pics/', blank=True, null=True)
    email = models.EmailField(max_length=254, blank=True, null=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

    def __str__(self):
        return f"{self.user.username} ({self.get_role_display()})"
