import uuid
from utils.helpers import human_readable_size
from utils.query import get_object_or_none
from utils.serializers import ModelSerializer


from utils.serializers import ModelSerializer
from rest_framework import serializers
from .models import Folder, File
from django.db import transaction
from django_drf_filepond.models import TemporaryUpload, StoredUpload
from django_drf_filepond.api import store_upload


class FolderSerializer(ModelSerializer):

    class Meta:
        model = Folder
        fields = (
            'id',
            'uid',
            'user',
            'name',
            'parent',
            'created_at',
            'updated_at',
        )
        extra_kwargs = {
            'user': {'write_only': True }
        }


    def create(self, validated_data):
        return super().create(validated_data)


    def to_representation(self, instance):
        dt =  super().to_representation(instance)
        dt['files_total'] = instance.files.count()
        dt['folders_total'] = instance.children.count()
        dt['user_name'] = instance.user.display_name()
        if instance.parent:
            dt['parent_uid'] = instance.parent.uid
            dt['parent_name'] = instance.parent.name

        return dt

class StoredUploadSerializer(ModelSerializer):
    class Meta:
        model = StoredUpload
        fields = (
            'file',
        )
        read_only_fields = ('user', 'stored_file_id')

    @transaction.atomic
    def create(self, validated_data):
        instance =  super().create(validated_data)
        return instance


class FileSerializer(ModelSerializer):
    upload_id =serializers.CharField(
        required=True,
        write_only=True
    ) 

    class Meta:
        model = File
        fields = (
            'id',
            'uid',
            'user',
            'folder',
            'upload_id',
            'updated_at',
            'created_at',
        )

        read_only_fields = ('user',)

    @transaction.atomic
    def create(self, validated_data):
        upload_id = validated_data.pop('upload_id')
        temp_upload = get_object_or_none(TemporaryUpload, upload_id=upload_id)

        if not temp_upload:
            raise serializers.ValidationError('Uploaded file not found')

        stored_upload = store_upload(upload_id, uuid.uuid4().hex + temp_upload.upload_name)
        validated_data['name'] = temp_upload.upload_name[:254]
        validated_data['stored_file'] = stored_upload
        instance =  super().create(validated_data)

        return instance

    def to_representation(self, instance):
        dt = super().to_representation(instance)

        dt['file'] = StoredUploadSerializer(instance.stored_file, context=self.context).data['file']
        dt['filename'] = instance.name
        dt['filesize'] = human_readable_size(instance.stored_file.file.size) 
        dt['user_name'] = instance.user.display_name() 

        return dt