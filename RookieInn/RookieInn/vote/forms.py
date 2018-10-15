#coding=utf-8
from django.forms import ModelForm
from .models import Question, Choice

class QuestionForm(ModelForm):
	class Meta:
		model = Question
		exclude = ['author','alreadyVote']

class ChoiceForm(ModelForm):
	class Meta:
		model = Choice
		fields = ('question', 'choiceText')