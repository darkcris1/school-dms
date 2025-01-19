import os
import uuid
from django.conf import settings

from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models


from .managers import UserManager


class User(AbstractBaseUser, PermissionsMixin):
    """user information"""

    email = models.EmailField(max_length=255, unique=True)

    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)

    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ("first_name", "last_name")