# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

# 用户模块
class User(AbstractUser):
    
    class Meta(AbstractUser.Meta):
        pass

# 作业模块
class Mission(models.Model):
    createdTime = models.DateTimeField(auto_now_add=True)    # 发布时间
    author = models.CharField(u'发布者', max_length=20)       # 发布者
    isActive = models.BooleanField(u'状态', default=True)    # 是否结束
    title = models.CharField(u'标题', max_length=50)        # 作业简介
    content = models.CharField(u'内容', max_length=200)      # 作业内容

    class Meta:
        ordering = ['createdTime']  # 默认时间降序排列