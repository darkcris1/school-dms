from utils.views import APIViewset
from .serializers import UserSerializer

class AuthUserView(APIViewset):
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user