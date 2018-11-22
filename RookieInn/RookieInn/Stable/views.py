# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import reverse, render, HttpResponseRedirect, get_object_or_404,HttpResponse
import json
from .models import Device, Log
import logging
from django.contrib import messages

logger = logging.getLogger('stable')

# Create your views here.

# 主页
def index(request):
    if request.method == 'POST':
        pass
    else:
        devices = Device.objects.all()
        devices_in_loading = len(Device.objects.filter(status=u'待批准'))
        return render(request, 'Stable/index.html', context={
            'devices' : devices,
            'devices_in_loading' : devices_in_loading,
        })

# 未使用->待批准
def submit(request):
    if request.is_ajax() and request.method == "POST":
        ret = {'status':'', 'error':1, 'user':'', 'information':'','isAdmin':'','ip':''}
        pk = request.POST.get("pk")
        information = request.POST.get("content")
        device = get_object_or_404(Device, pk=pk)
        if device.status == '未使用':
            ret['error'] = 0
            device.information = information
            device.user = request.user.nickname
            device.status = '待批准'
            device.save()
            ret['user'] = device.user
            ret['information'] = device.information
            ret['ip'] = device.ip
            info = '{0}申请{1}点位成功,待管理员{2}批准\r'.format(request.user.nickname, device.location, device.admin)
            logger.info(info)
            Log.objects.create(handler=request.user.nickname, content=info)
        else:
            messages.warning(request, "操作失败，该点位已经被{0}申请使用".format(device.user))
            return HttpResponseRedirect(reverse('Stable:index'))
        ret['isAdmin'] = request.user.isAdminStable
        ret['status'] = device.status
        return HttpResponse(json.dumps(ret))
    else:
        return HttpResponseRedirect(reverse('Stable:index'))

# 待批准->使用中
def approve(request):
    if request.is_ajax() and request.method == "POST":
        pk = request.POST.get("pk")
        ret = {'error':1, 'status':''}
        device = get_object_or_404(Device, pk=pk)
        if device.status == '待批准':
            ret['error'] = 0
            device.status = '使用中'
            device.save()
            info = '管理员{2}批准{0}的使用{1}点位申请\r'.format(device.user, device.location, request.user.nickname)
            logger.info(info)
            Log.objects.create(handler=request.user.nickname, content=info)
        else:
            messages.warning(request, "操作失败，该点位已经被批准或者用户取消了申请")
            return HttpResponseRedirect(reverse('Stable:index'))
        ret['status'] = device.status
        return HttpResponse(json.dumps(ret))
    else:
        return HttpResponseRedirect(reverse('Stable:index'))

# 使用中->未使用 and 待批准->未使用
def delete(request):
    if request.is_ajax() and request.method == "POST":
        ret = {'error':1, 'status':'', 'isAdmin':''}
        pk = request.POST.get("pk")
        device = get_object_or_404(Device, pk=pk)
        if request.user.nickname == device.user or request.user.isAdminStable:
            ret['error'] = 0
            device.status = '未使用'
            device.information = ''
            device.user = ''
            device.save()
            info = '点位{0}由{1}重置为未使用状态\r'.format(device.location, request.user.nickname)
            logger.info(info)
            Log.objects.create(handler=request.user.nickname, content=info)
        elif not device.user:
            messages.warning(request, "操作失败，该点位已经处于未使用状态了")
            return HttpResponseRedirect(reverse('Stable:index'))
        else:
            messages.warning(request, "操作失败，该点位已经被{0}申请使用".format(device.user))
            return HttpResponseRedirect(reverse('Stable:index'))
        ret['isAdmin'] = request.user.isAdminStable
        ret['status'] = device.status
        return HttpResponse(json.dumps(ret))
    else:
        return HttpResponseRedirect(reverse('Stable:index'))

# 日志处理
def log(request):
    logs = Log.objects.all()
    return render(request, 'Stable/log.html', context={
        'logs' : logs,
    })