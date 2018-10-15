# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin
from .models import Question, Choice

# Register your models here.

class ChoiceInline(admin.StackedInline):
	model = Choice
	extra = 1

class QuestionAdmin(admin.ModelAdmin):
	fieldsets = [
		(None, {'fields':['title','author','choose','alreadyVote']}),
	]
	inlines = [ChoiceInline]

admin.site.register(Question, QuestionAdmin)
