# Generated by Django 5.0 on 2025-01-23 19:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('files', '0002_file_created_at_file_updated_at'),
    ]

    operations = [
        migrations.AddField(
            model_name='file',
            name='name',
            field=models.CharField(max_length=255, null=True),
        ),
    ]
