# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2018-10-25 14:01
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Stable', '0004_auto_20181008_2337'),
    ]

    operations = [
        migrations.CreateModel(
            name='Log',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateTimeField(auto_now_add=True)),
                ('handler', models.CharField(max_length=20, verbose_name='\u64cd\u4f5c\u8005')),
                ('content', models.CharField(max_length=100, verbose_name='\u5185\u5bb9')),
            ],
            options={
                'ordering': ['-date'],
            },
        ),
        migrations.AlterModelOptions(
            name='device',
            options={'ordering': ['-status']},
        ),
    ]
