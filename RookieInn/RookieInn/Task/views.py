# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.core.mail import send_mail
from django.conf import settings
from .forms import RegisterForm, UploadFileForm
from .models import User, Mission, Upfile
from itsdangerous import URLSafeTimedSerializer as utsr
import base64

import socket


# 获取本机电脑名
name = socket.getfqdn(socket.gethostname())
# 获取本机IP
addr = socket.gethostbyname(name)

# Create your views here.

# itesdangerous序列化方法自带时间戳，比单纯base64加密给力很多
class Token():
    def __init__(self, security_key):
        self.security_key = security_key
        self.salt = base64.encodestring(security_key)

    def generate_validate_token(self, username):
        serializer = utsr(self.security_key)
        return serializer.dumps(username, self.salt)

    def confirm_validate_token(self, token, expiration=3600): # 国企默认时间为3600秒
        serializer = utsr(self.security_key)
        return serializer.loads(token, salt=self.salt, max_age=expiration)

token_confirm = Token(settings.SECRET_KEY)

def index(request):
    if request.method == "POST":
        pass
    else:
        files = UploadFileForm()
        missions = Mission.objects.all()
        aboutUserFiles = Upfile.objects.filter(uploader=request.user.username)
        status = [ file.mission.pk for file in aboutUserFiles]
    return render(request, 'Task/index.html', context={
        'missions' : missions,
        'files'    : files,
        'status'   : status,
    })

# 账号注册页面
def register(request):
    redirect_to = request.POST.get('next', request.GET.get('next', ''))
    if request.method == 'POST':
        form = RegisterForm(request.POST)

        if form.is_valid():
            #form.save()

            # 创建用户时is_active为False，此时还不是有效用户
            cd = form.cleaned_data
            username, password, email, nickname = cd['username'], cd['password1'], cd['email'], cd['nickname']
            user = User.objects.create(username=username, password=password, email=email, nickname=nickname, is_active=False)
            user.set_password(password)
            user.save()

            # 生成令牌并发送
            token = token_confirm.generate_validate_token(username)
            message = u'{0}，欢迎注册，请访问http://{1}:8000/activate/{2}，完成用户验证。'.format(nickname, addr, token)
            title = u'注册用户验证信息'
            # 目前会报编码相关的错误，等修复了再开放此功能
            try:
                send_mail(title, message, settings.DEFAULT_FROM_EMAIL, [email,], fail_silently=False)
                print 'success'
            except Exception as e:
                user.is_active = True
                user.save()
                print e

            if redirect_to:
                return redirect(redirect_to)
            else:
                return redirect('/auth/login')
    else:
        form = RegisterForm()

    return render(request, 'registration/register.html', context={
        'form' : form,
        'next' : redirect,
    })

# 用户激活
def active_user(request, token):
    try:
        username = token_confirm.confirm_validate_token(token)
    except:
        User.objects.get(username=username).delete()
        return HttpResponse(u'对不起， 验证连接已经过期')
    try:
        user = User.objects.get(username=username)
    except:
        return HttpResponse(u'对不起， 您所验证的用户不存在， 请重新注册')
    user.is_active = True
    user.save()

