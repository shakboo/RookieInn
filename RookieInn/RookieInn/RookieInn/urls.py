"""RookieInn URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin
from . import views as index
from Task import views 

urlpatterns = [
    url(r'^$', index.index, name='index'),
    url(r'^auth/', include('django.contrib.auth.urls')),
    url(r'^register/', views.register, name='register'),
    url(r'^admin/', admin.site.urls),
    url(r'^Task/', include('Task.urls')),
    url(r'^Stable/', include('Stable.urls')),
    url(r'^vote/', include('vote.urls')),
    url(r'^Datum/', include('Datum.urls')),
]