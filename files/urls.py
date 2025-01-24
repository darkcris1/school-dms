from django.urls import path, include
from .views import FileView, FolderView

app_name = 'files'

urlpatterns = [
    path('folders/', include([
        path('', FolderView.as_view({
            'post': 'create',
            'get': 'list',
        }), name='folders'),
        path('<uuid:uid>/', FolderView.as_view({
            'put': 'update',
            'get': 'retrieve',
            'delete': 'destroy',
        }), name='folders-detail'),
    ])),

    path('', include([
        path('', FileView.as_view({
            'get': 'list',
            'post': 'create',
        }), name='files'),
        path('<uuid:uid>/', FileView.as_view({
            'put': 'update',
            'get': 'retrieve',
            'delete': 'destroy',
        }), name='files-detail'),
    ])),
]