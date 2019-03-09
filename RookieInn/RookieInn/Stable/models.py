# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.utils import timezone

# Create your models here.

# 稳定性点位信息
class Device(models.Model):
    ip = models.CharField(u'IP', max_length=20, blank=True)
    location = models.CharField(u'位置', max_length=50, unique=True)
    admin = models.CharField(u'管理员', max_length=20, blank=True)
    user = models.CharField(u'使用者', max_length=20, blank=True)
    information = models.TextField(u'设备信息', max_length=100, blank=True)
    expiration = models.DateField(u'过期时间', blank=True, null=True)

    CHOOSE_BOX = (
        (u'未使用', u'未使用'),
        (u'待批准', u'待批准'),
        (u'使用中', u'使用中'),
    )

    status = models.CharField(u'状态', max_length=10, choices=CHOOSE_BOX, default='未使用')

    def __unicode__(self):
        return self.location

    class Meta:
        ordering = ['-status']

# web可视化log
class Log(models.Model):
    date = models.DateTimeField(u'日期', auto_now_add=True)
    handler = models.CharField(u'操作者', max_length=20)
    content = models.CharField(u'内容', max_length=100)

    def __unicode__(self):
        return self.date.strftime('%Y-%m-%d %H:%M:%S')

    class Meta:
        ordering = ['-date']

class Abnormal(models.Model):
    date = models.DateTimeField(u'日期', auto_now_add=True)
    handler = models.CharField(u'提交者', max_length=20)
    content = models.TextField(u'异常描述', max_length=1000)
    solution = models.TextField(u'解决方案', max_length=200)

    CHOOSE_BOX = (
        (u'待解决', u'待解决'),
        (u'已解决', u'已解决'),
    )

    status = models.CharField(u'状态', max_length=10, choices=CHOOSE_BOX, default='待解决')


    def __unicode__(self):
        return self.date.strftime('%Y-%m-%d %H:%M:%S')

    class Meta:
        ordering = ['-date']

