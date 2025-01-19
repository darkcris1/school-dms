from django.urls import path, include
from .views import AuthUserView

app_name = 'users'

urlpatterns = [
    path('me/', AuthUserView.as_view({
        'get': 'retrieve'
    }))
]