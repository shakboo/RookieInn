# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

# 用户模块
class User(AbstractUser):
    nickname = models.CharField(u'员工姓名', max_length=20, default='')
    isAdminStable = models.BooleanField(u'稳定性管理员', default=False, blank=True)

    def __unicode__(self):
        return self.nickname

    class Meta(AbstractUser.Meta):
        pass

# 作业模块
class Mission(models.Model):
    createdTime = models.DateTimeField(auto_now_add=True)    # 发布时间
    author = models.CharField(u'发布者', max_length=20)       # 发布者
    isActive = models.BooleanField(u'状态', default=True)    # 是否结束
    title = models.CharField(u'标题', max_length=50)        # 作业简介
    content = models.CharField(u'内容', max_length=200, blank=True)      # 作业内容

    class Meta:
        ordering = ['createdTime']  # 默认时间降序排列

    def __unicode__(self):
        return self.title

# 定义作业上传路径
def user_directory_path(instance, filename):
    return 'user_{0}/{1}'.format(instance.user.username, filename)

class Upfile(models.Model):
    mission = models.ForeignKey(Mission, on_delete=models.CASCADE, default='')
    uploader = models.CharField(max_length=20, default='')
    upload = models.FileField(upload_to=user_directory_path, blank=True)