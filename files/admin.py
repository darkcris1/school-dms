from django.contrib import admin
from .models import Folder, File
from django_drf_filepond.models import StoredUpload,  TemporaryUploadChunked, TemporaryUpload

admin.site.register(StoredUpload)
admin.site.register(TemporaryUploadChunked)
admin.site.register(TemporaryUpload)

@admin.register(Folder)
class FolderAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'created_at', 'updated_at')  # Columns to display in the admin list view
    search_fields = ('name',)  # Add a search bar to search by folder name
    list_filter = ('created_at', 'updated_at')  # Add filters for created and updated timestamps
    ordering = ('name',)  # Order by name by default

@admin.register(File)
class FileAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'folder', 'stored_file')  # Columns to display in the admin list view
    search_fields = ('user__username', 'folder__name', 'stored_file__upload_id')  # Search by user, folder, or file ID
    list_filter = ('folder',)  # Add a filter for folder
    ordering = ('folder', 'user')  # Order by folder and user
