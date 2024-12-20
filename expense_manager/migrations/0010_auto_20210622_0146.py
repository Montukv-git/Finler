# Generated by Django 2.0.7 on 2021-06-21 20:16

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('expense_manager', '0009_auto_20180716_0454'),
    ]

    operations = [
        migrations.AlterField(
            model_name='budget',
            name='month',
            field=models.PositiveSmallIntegerField(default=6, validators=[django.core.validators.MaxValueValidator(12), django.core.validators.MinValueValidator(1)]),
        ),
        migrations.AlterField(
            model_name='budget',
            name='year',
            field=models.PositiveSmallIntegerField(default=2021, validators=[django.core.validators.MaxValueValidator(2035), django.core.validators.MinValueValidator(2015)]),
        ),
    ]
