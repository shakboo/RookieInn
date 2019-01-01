#coding=utf-8

from django import template
from Stable.models import Device

register = template.Library()


# 用来筛选已经投票的人等类似场景
@register.filter
def status(value, values):
    return True if value in values else False

# 用来返回导航栏用户名下拉框中 我的设备 的数量
@register.simple_tag
def my_devices(username):
    devices= len(Device.objects.filter(user=username, status='使用中'))
    return devices

# 用来返回导航栏用户名下拉框中 待批设备 的数量
@register.simple_tag
def my_waiting_permit_devices(username):
    devices= len(Device.objects.filter(user=username, status='待批准'))
    return devices