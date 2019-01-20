# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.urls import reverse

# Create your models here.

class Question(models.Model):
    author = models.CharField('发起人',max_length=20)
    created_time = models.DateTimeField(auto_now_add=True)
    title = models.CharField('标题', max_length=50)
    #需要加一个标识来确认此用户已经投过票
    alreadyVote = models.CharField('已参与人员',max_length=1000,default="", blank=True)

    CHOOSE_BOX = (
        (u'投票',u'投票'),
        (u'问答',u'问答'),
    )

    choose = models.CharField('类型',max_length=15,choices=CHOOSE_BOX,default="投票")

    def __unicode__(self):
        return self.title

    #进行投票问卷详情页跳转
    def get_absolute_detail(self):
        return reverse('vote:detail', kwargs={'pk':self.pk})
    
    #进行投票问卷结果详情页跳转
    def get_absolute_result(self):
        return reverse('vote:result',kwargs={'pk':self.pk})
    

    #默认时间降序排列
    class Meta:
        ordering = ['-created_time']

class Choice(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    choiceText = models.TextField('问题', max_length=200)
    choiceAnswer = models.TextField('问答结果', max_length=1000, default="", blank=True)
    choiceVote = models.IntegerField('投票结果', default=0, blank=True)
    whoVote = models.CharField('投票人', max_length=200, default="", blank=True)

    class Meta:
        ordering = ['pk']
            