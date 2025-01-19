from django.shortcuts import get_object_or_404

from rest_framework.viewsets import ModelViewSet


class APIViewset(ModelViewSet):
    """ DRF model viewset extension.
    """
    permissions_by_action = {}
    authentications_by_action = {}
    public_actions = []

    def initialize_request(self, request, *args, **kwargs):
        """ fix self.action to get assign first before the get_authenticators """
        self.action = self.action_map.get(request.method.lower())
        return super().initialize_request(request, *args, **kwargs)

    def get_permissions(self):
        if self.action in self.public_actions: return []
        try:
            # Return the permission classes for the current action
            return [permission() for permission in self.permissions_by_action[self.action]]
        except KeyError:
            # If the action is not in the permissions_by_action dict, use the default permission_classes
            return [permission() for permission in self.permission_classes]

    def get_authenticators(self):
        try:
            # return authentication_classes depending on `action`
            return [authentication() for authentication in self.authentications_by_action[self.action]]
        except KeyError:
            # action is not set return default authentication_classes
            return [authentication() for authentication in self.authentication_classes]


    @property
    def model(self):
        """ return the serializer model
        """
        return self.serializer_class.Meta.model

    def get_queryset(self):
        return self.model.objects.all()

    def get_object(self):
        """ return the object based on the url combination
        """
        return get_object_or_404(self.get_queryset(), **self.kwargs)
    
    def get_request_data(self, **kwargs):
        """ return the request data combine with
            the kwargs (if provided)
        """
        data = self.request.data.copy()  # Make a mutable copy of the QueryDict
        data.update(kwargs)

        return data