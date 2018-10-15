# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render, get_object_or_404, HttpResponseRedirect, reverse
from .models import Question, Choice
from .forms import QuestionForm, ChoiceForm
from Task.models import User
import os
nextLine = os.linesep

# Create your views here.

def index(request):
	questionList = Question.objects.all().order_by('-created_time')
	try:
		username = str(request.user.nickname)
	except:
		username = str(request.user.username)
	voteList = []
	for question in questionList:
		if question.alreadyVote.find(username) == -1:
			voteList.append(0)
		else:
			voteList.append(1)
	voteDict = zip(questionList, voteList)

	if request.method == 'POST':
		pass
	else:
		return render(request, 'vote/index.html', context={
				'voteDict' : voteDict,
			})

def detail(request,pk):
	question = get_object_or_404(Question, pk=pk)
	try:
		preventJump = question.choice_set.get(pk=request.POST['choice'])
		selectChoices = request.POST.getlist('choice')
	except:
		return render(request, 'vote/detail.html', context={
				'question' : question,
			})
	else:
		for selectedChoiceId in selectChoices:
			selectChoice = question.choice_set.get(pk=selectedChoiceId)
			if selectChoice.whoVote.find(str(request.user.nickname)) == -1:
				if question.choose == '投票' or question.choose == '公告':
					selectChoice.choiceVote += 1
					selectChoice.whoVote += str(request.user.nickname) + ' '
					selectChoice.save()
				elif question.choose == "问答":
					selectChoice.choiceAnswer += (request.POST[str(selectedChoiceId)] + " --" + str(request.user.nickname)) + nextLine
					selectChoice.whoVote += str(request.user.nickname) + ' '
					selectChoice.save()

			if question.alreadyVote.find(str(request.user.nickname)) == -1:
				question.alreadyVote += str(request.user.nickname) + ' '
				question.save()

	return HttpResponseRedirect(reverse('vote:index'))

def result(request, pk):
	question = get_object_or_404(Question, pk=pk)
	return render(request, 'vote/result.html', context={
			'question' : question,
		})

def edit(request):
	if request.POST:
		question = QuestionForm()
		question = question.save(commit=False)
		question.author = str(request.user.nickname) if request.user.nickname else str(request.user.username)
		question.title = request.POST['title']
		question.choose = request.POST['voteChoose']
		question.save()
		choiceList = request.POST['choiceText'].split(nextLine) if question.choose == '公告' else request.POST.getlist("choiceText", "")
		for choiceValue in choiceList:
			choice = ChoiceForm()
			choice = choice.save(commit=False)
			choice.choiceText = choiceValue
			choice.question = question
			choice.save()
		return HttpResponseRedirect(reverse('vote:index'))

	else:
		return render(request, 'vote/edit.html')
