# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from .forms import RegisterForm, UploadFileForm
from .models import User, Mission, Upfile

# Create your views here.

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
            form.save()

            if redirect_to:
                return redirect(redirect_to)
            else:
                return redirect('/')
    else:
        form = RegisterForm()

    return render(request, 'registration/register.html', context={
        'form' : form,
        'next' : redirect,
    })