#coding=utf-8

from django.conf.urls import url
from . import views

app_name = 'Stable'
urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^submit/(?P<pk>[0-9]+)/$', views.submit, name='submit'),
    url(r'^approve/(?P<pk>[0-9]+)/$', views.approve, name='approve'),
    url(r'^delete/(?P<pk>[0-9]+)/$', views.delete, name='delete'),
]