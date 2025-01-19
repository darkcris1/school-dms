from utils.query import get_object_or_none
from utils.serializers import ModelSerializer


from utils.serializers import ModelSerializer
from rest_framework import serializers
from .models import Folder, File
from django.db import transaction
from django_drf_filepond.models import TemporaryUpload
from django_drf_filepond.api import store_upload


class FolderSerializer(ModelSerializer):

    class Meta:
        model = Folder
        fields = (
            'id',
            'uid',
            'name',
            'files',
            'created_at',
            'updated_at',
        )


    def to_representation(self, instance):
        dt =  super().to_representation(instance)
        dt['files_total'] = instance.files.count()
        dt['folders_total'] = instance.children.count()

        return dt


class FileSerializer(ModelSerializer):
    folder = FolderSerializer(read_only=True)
    upload_id = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = File
        fields = (
            'id',
            'uid',
            'user',
            'folder',
            'upload_id',
            'stored_file',
        )

        read_only_fields = ('user', 'stored_file_id')

    @transaction.atomic
    def create(self, validated_data):
        upload_id = validated_data.pop('upload_id')
        temp_upload = get_object_or_none(TemporaryUpload, upload_id=upload_id)

        if not temp_upload:
            raise serializers.ValidationError('Uploaded file not found')

        stored_upload = store_upload(upload_id, temp_upload.upload_name)
        instance.stored_file = stored_upload
        validated_data['stored_file'] = stored_upload
        instance =  super().create(validated_data)

        return instance