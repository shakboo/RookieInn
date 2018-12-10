#coding=utf-8

from django.contrib.auth.forms import UserCreationForm
from .models import User, Upfile
from django.forms import ModelForm

class RegisterForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = User
        fields = ('username', 'nickname', 'email')

class UploadFileForm(ModelForm):
    class Meta:
        model = Upfile
        fields = ('upload',)
