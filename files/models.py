from django.db import models
from django_drf_filepond.models import StoredUpload
from uuid import uuid4 


class Folder(models.Model):
    user = models.ForeignKey(
        "users.User", on_delete=models.CASCADE, related_name="folders"
    )

    uid = models.UUIDField(default=uuid4, editable=False, unique=True)
    name = models.CharField(max_length=255)
    parent = models.ForeignKey(
        "self", on_delete=models.CASCADE, null=True, blank=True, related_name="children"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class File(models.Model):

    user = models.ForeignKey(
        "users.User", on_delete=models.CASCADE, related_name="files"
    )

    uid = models.UUIDField(default=uuid4, editable=False, unique=True)
    folder = models.ForeignKey(
        Folder, on_delete=models.CASCADE, related_name="files", null=True, blank=True
    )
    name = models.CharField(max_length=255, null=True)
    stored_file = models.OneToOneField(
        StoredUpload, on_delete=models.CASCADE, related_name="fp_file"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)