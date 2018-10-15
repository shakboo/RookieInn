# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

# Create your models here.

class Device(models.Model):
    ip = models.CharField(u'IP', max_length=20)
    location = models.CharField(u'位置', max_length=50)
    admin = models.CharField(u'管理员', max_length=20)
    user = models.CharField(u'使用者', max_length=20, blank=True)
    information = models.TextField(u'设备信息', max_length=100, blank=True)

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
