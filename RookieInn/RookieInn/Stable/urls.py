#coding=utf-8

from django.conf.urls import url
from . import views

app_name = 'Stable'
urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^submit/$', views.submit, name='submit'),
    url(r'^approve/$', views.approve, name='approve'),
    url(r'^delete/$', views.delete, name='delete'),
    url(r'^log/$', views.log, name='log'),
    url(r'^ping/$', views.ping, name="ping"),
    url(r'^abnormal/$', views.abnormal, name="abnormal"),
]