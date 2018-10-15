#coding=utf-8

from django.conf.urls import url
from . import views

app_name = 'Datum'
urlpatterns = [
    url(r'^$', views.index, name='index'),
]