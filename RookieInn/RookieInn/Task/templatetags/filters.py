#coding=utf-8

from django import template

register = template.Library()

@register.filter
def status(value, values):
    return True if value in values else False