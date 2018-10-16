# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import reverse, render, HttpResponseRedirect, get_object_or_404,HttpResponse
import json
from .models import Device
import logging
from django.contrib import messages

logger = logging.getLogger('stable')

# Create your views here.

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

'''
def submit(request, pk):
    device = get_object_or_404(Device, pk=pk)
    if device.status == '未使用':
        device.information = request.POST['information']
        device.user = request.user.nickname
        device.status = '待批准'
        device.save()
        logger.info('{0}申请{1}点位成功,待管理员{2}批准'.format(request.user.nickname, device.location, device.admin))
    else:
        messages.warning(request, "操作失败，该点位已经被{0}申请使用".format(device.user))
    return HttpResponseRedirect(reverse('Stable:index'))
'''
def submit(request):
    if request.is_ajax() and request.method == "POST":
        pk = request.POST.get("pk")
        information = request.POST.get("content")
        device = get_object_or_404(Device, pk=pk)
        if device.status == '未使用':
            device.information = information
            device.user = request.user.nickname
            device.status = '待批准'
            device.save()
            logger.info('{0}申请{1}点位成功,待管理员{2}批准'.format(request.user.nickname, device.location, device.admin))
        else:
            messages.warning(request, "操作失败，该点位已经被{0}申请使用".format(device.user))
        status = device.status
        return HttpResponse(json.dumps({"status":status}))
    else:
        return HttpResponseRedirect(reverse('Stable:index'))


def approve(request, pk):
    device = get_object_or_404(Device, pk=pk)
    if device.status == '待批准':
        device.status = '使用中'
        device.save()
        logger.info('管理员{2}批准{0}的使用{1}点位申请'.format(device.user, device.location, request.user.nickname))
    return HttpResponseRedirect(reverse('Stable:index'))

def delete(request, pk):
    device = get_object_or_404(Device, pk=pk)
    if request.user.nickname == device.user or request.user.isAdminStable or not device.user:
        device.status = '未使用'
        device.information = ''
        device.user = ''
        device.save()
        logger.info('点位{0}由{1}重置为未使用状态'.format(device.location, request.user.nickname))
    else:
        messages.warning(request, "操作失败，该点位已经被{0}申请使用".format(device.user))
    return HttpResponseRedirect(reverse('Stable:index'))