"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static
from django.conf.urls import include
from django.shortcuts import render

def upload_page(request):
    return render(request, 'uploads/index.html')

app_name = 'my_app'

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include([
        path('auth/', include(('dj_rest_auth.urls', 'auth'), namespace='auth')),
        path('users/', include('users.urls', namespace='users')),
        path('files/', include('files.urls', namespace='files')),
        path('fp/', include('django_drf_filepond.urls')),
    ])),
    path('upload/', upload_page),
]


urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)