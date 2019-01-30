# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import reverse, render, HttpResponseRedirect, get_object_or_404,HttpResponse
import json
import os, sys
from .models import Device, Log, Abnormal
import logging
from django.contrib import messages
from django.core.mail import send_mail
from django.conf import settings

logger = logging.getLogger('stable')
platform = sys.platform
# Create your views here.

def ping_single(ip):
    ip_list= ip.split('.')
    if len(ip_list) != 4:
        return "error"
    for i in ip_list:
        if 0 <= int(i) <= 255:
            pass
        else:
            return "error"
    # Linux 下
    global platform
    if str(platform) != "win32":
        backinfo = os.system('ping -c 1 -w 1 {0}'.format(ip))

    # windows 下
    else:
        backinfo = os.system('ping -n 1 -w 1 {0}'.format(ip))

    return backinfo

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
        ret = {'status':'', 'error':1, 'user':'', 'information':'','isAdmin':'','expiration':'','admin':'', 'ip':'', 'ping':''}
        pk = request.POST.get("pk")
        information = request.POST.get("content")
        expiration = request.POST.get("expiration")
        addip = request.POST.get("addip")
        device = get_object_or_404(Device, pk=pk)

        if not device.ip and len(Device.objects.filter(ip=addip)):
            ret['error'] = 1
            return HttpResponse(json.dumps(ret))

        backinfo = ping_single(addip)
        if str(backinfo) == "512" or str(backinfo) == "error":
            ret['error'] = 3
            return HttpResponse(json.dumps(ret))
        if backinfo :
            ret['ping'] = 0
        else:
            ret['ping'] = 1
    
        if device.status == '未使用':
            ret['error'] = 0
            device.information = information
            device.expiration = expiration
            device.user = request.user.nickname
            device.ip = addip if not device.ip else device.ip
            device.status = '待批准'
            device.save()
            info = '{0}申请{1}点位成功,待管理员批准\r'.format(request.user.nickname, device.location)
            logger.info(info)
            Log.objects.create(handler=request.user.nickname, content=info)
        else:
            ret['error'] = 2
            return HttpResponse(json.dumps(ret))
    
        ret['user'] = device.user
        ret['information'] = device.information
        ret['expiration'] = device.expiration
        ret['ip'] = device.ip
        ret['isAdmin'] = request.user.isAdminStable
        ret['status'] = device.status
        ret['admin'] = device.admin
        return HttpResponse(json.dumps(ret))
    else:
        return HttpResponseRedirect(reverse('Stable:index'))

# 待批准->使用中
def approve(request):
    if request.is_ajax() and request.method == "POST":
        pk = request.POST.get("pk")
        ret = {'error':1, 'status':'', 'isChangeDevicesNum':0}
        device = get_object_or_404(Device, pk=pk)
        if device.status == '待批准':
            ret['error'] = 0
            device.status = '使用中'
            device.save()
            info = '管理员{2}批准{0}的使用{1}点位申请\r'.format(device.user, device.location, request.user.nickname)
            logger.info(info)
            Log.objects.create(handler=request.user.nickname, content=info)
        else:
            ret['error'] = 1
            return HttpResponse(json.dumps(ret))
        ret['status'] = device.status
        
        # 批准者和点位申请者是同一人，需要局部刷新该用户下拉框的设备数量
        if device.user == request.user.nickname:
            ret['isChangeDevicesNum'] = 1

        return HttpResponse(json.dumps(ret))
    else:
        return HttpResponseRedirect(reverse('Stable:index'))

# 使用中->未使用 and 待批准->未使用
def delete(request):
    if request.is_ajax() and request.method == "POST":
        ret = {'error':1, 'status':'', 'isAdmin':'', 'isChangeDevicesNum':0}
        pk = request.POST.get("pk")
        device = get_object_or_404(Device, pk=pk)
        if request.user.nickname == device.user or request.user.isAdminStable:

            if request.user.nickname != device.user:
                ret['error'] = 2
                return HttpResponse(json.dumps(ret))

            # 批准者和点位申请者是同一人，需要局部刷新该用户下拉框的设备数量
            if device.user == request.user.nickname:
                ret['isChangeDevicesNum'] = 1
            ret['error'] = 0
            device.status = '未使用'
            device.information = ''
            device.user = ''
            device.save()
            info = '点位{0}由{1}重置为未使用状态\r'.format(device.location, request.user.nickname)
            logger.info(info)
            Log.objects.create(handler=request.user.nickname, content=info)
        elif not device.user:
            ret['error'] = 1
            return HttpResponse(json.dumps(ret))

        ret['isAdmin'] = request.user.isAdminStable
        ret['status'] = device.status
        ret['ip'] = device.ip
        return HttpResponse(json.dumps(ret))
    else:
        return HttpResponseRedirect(reverse('Stable:index'))

# 日志处理
def log(request):
    logs = Log.objects.all()
    return render(request, 'Stable/log.html', context={
        'logs' : logs,
    })

# 后台ping设备
def ping(request):
    ret =  {'error':''}
    if request.is_ajax() and request.method == "GET":
        devices = Device.objects.all()
        all_ip  =  [device.ip for device in devices]
        for ip in all_ip:
            if not ip:
                continue
            backinfo = ping_single(ip)
            if backinfo :
                ret[ip] = 0
            else:
                ret[ip] = 1
    if request.is_ajax() and request.method == "POST":
        ip = request.POST.get('ip')
        backinfo = ping_single(ip)
        if str(backinfo) == "512" or str(backinfo) == "error":
            ret['error'] = 3
            return HttpResponse(json.dumps(ret))
        if backinfo and not len(Device.objects.filter(ip=ip)):
            ret['ping'] = 0
        else:
            ret['ping'] = 1
    return HttpResponse(json.dumps(ret))

        

# 异常解决进度页面
def abnormal(request):
    if request.is_ajax() and request.method == "POST":
        ret={}
        information = request.POST.get("information")
        Abnormal.objects.create(handler=request.user.nickname, content=information)
        return HttpResponse(json.dumps(ret))
    else:
        abnormals = Abnormal.objects.all()
        return render(request, 'Stable/abnormal.html', context={
            'abnormals' : abnormals,
        })