# Generated by Django 2.0.7 on 2018-07-13 19:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('expense_manager', '0004_auto_20180713_1010'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='expense',
            options={'ordering': ('-created',)},
        ),
        migrations.AlterField(
            model_name='expense',
            name='photo',
            field=models.ImageField(blank=True, null=True, upload_to='media/'),
        ),
    ]