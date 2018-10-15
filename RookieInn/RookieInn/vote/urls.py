#coding=utf-8

from django.conf.urls import url
from . import views

app_name = 'vote'
urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^detail/(?P<pk>[0-9]+)/$', views.detail, name='detail'),
    url(r'^result/(?P<pk>[0-9]+)/$', views.result, name='result'),
    url(r'^edit/$', views.edit, name='edit'),
]
