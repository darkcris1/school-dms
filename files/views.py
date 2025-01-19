from django.shortcuts import get_object_or_404
from django.db import transaction
from rest_framework.response import Response
from utils.views import APIViewset
from .serializers import FolderSerializer, FileSerializer
from rest_framework import status


class FolderView(APIViewset):
    serializer_class = FolderSerializer
    search_fields = ("name",)

    def get_queryset(self):
        return super().get_queryset()\
            .select_related('parent')\
            .prefetch_related('children', 'files', 'user')

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        data = self.get_request_data(user=request.user)
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=201)

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        data = self.get_request_data()
        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)


class FileView(APIViewset):
    serializer_class = FileSerializer
    search_fields = ("name",)

    def get_queryset(self):
        return self.model.objects\
            .select_related('folder', 'stored_file', 'user')

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        data = self.get_request_data(user=request.user)
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        data = self.get_request_data()
        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)

        return Response(serializer.data)
