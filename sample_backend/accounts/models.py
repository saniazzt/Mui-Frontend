from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    USER_TYPE_CHOICES = (
        ('user', 'Normal User'),
        ('admin', 'Admin'),
        ('superadmin', 'Super Admin'),
    )
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES, default='user')

    # Optional profile fields (not required for sign in/sign up)
    name = models.CharField(max_length=150, blank=True, null=True)
    photoURL = models.JSONField(blank=True, null=True)
    phoneNumber = models.CharField(max_length=30, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    zipCode = models.CharField(max_length=20, blank=True, null=True)
    about = models.TextField(blank=True, null=True)
    isPublic = models.BooleanField(default=False)

# Create your models here.

# class Message(models.Model):
#     sender = models.ForeignKey(CustomUser, related_name='sender', on_delete=models.CASCADE)
#     receiver = models.ForeignKey(CustomUser, related_name='receiver', on_delete=models.CASCADE)
#     message = models.TextField()
#     created_at = models.DateTimeField(auto_now_add=True)
#
#     def __str__(self):
#         return f"message from {self.sender.username}"
