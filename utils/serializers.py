
from django.db import transaction

from rest_framework.serializers import ModelSerializer as DRFModelSerializer, Serializer as DRFSerializer


class ModelSerializer(DRFModelSerializer):
    """ Set the model serializer to have capability
        to customize fields.
    """
    field_list = []
    field_kwargs = []

    def __init__(self, *args, **kwargs):
        self.field_list = kwargs.pop('fields', [])
        self.fields_kwargs = kwargs.pop('fields_kwargs', [])
        excluded_fields = kwargs.pop('excluded_fields', [])

        super().__init__(*args, **kwargs)

        # if fields are specified, cross check with the
        # list of fields `self.Meta.fields`. load only the ones specified
        if self.field_list:
            [self.fields.pop(f, None) for f in list(set(self.Meta.fields) - set(self.field_list))]

        # if excluded_fields are specified, remove it from
        # the list of fields. `self.Meta.fields`
        if excluded_fields:
            [self.fields.pop(f, None) for f in excluded_fields]

    def get_request(self):
        """ return the WSGI request
        """
        return self.context.get('request')

    def filter_response(self, data):
        """ filter out the response based on the fields list
        """
        def keyset(d):
            return set(dict(d).keys())

        allowed_fields = list(keyset(data) - keyset(self.fields))
        [data.pop(f) for f in allowed_fields]

        return data

    @transaction.atomic
    def create(self, validated_data):
        return super().create(validated_data)

    @transaction.atomic
    def update(self, instance, validated_data):
        return super().update(instance, validated_data)


class Serializer(DRFSerializer):
    """ Extension of DRF serializer class
    """
    def get_request(self):
        """ return the WSGI request
        """
        return self.context.get('request')