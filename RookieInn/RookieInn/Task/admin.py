# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin
from .models import User, Mission, Upfile
# Register your models here.

admin.site.register(User)
admin.site.register(Mission)

'''
class uploadFileInline(admin.StackedInline):
	model = Upfile
	extra = 1

class missionAdmin(admin.ModelAdmin):
	inlines = [uploadFileInline]

admin.site.register(Mission, missionAdmin)
'''
