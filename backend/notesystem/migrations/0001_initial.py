# Generated by Django 4.2.1 on 2023-05-23 10:32

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Audio',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('audio_urls', models.URLField()),
                ('audio_name', models.CharField(max_length=50, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Playlist',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('playlist_name', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='Sectionmark',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('start', models.IntegerField()),
                ('end', models.IntegerField()),
                ('text', models.TextField(blank=True, default='')),
                ('audio_id', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='notesystem.audio')),
            ],
        ),
        migrations.CreateModel(
            name='Pointmark',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('point', models.IntegerField()),
                ('text', models.TextField(blank=True, default='')),
                ('audio_id', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='notesystem.audio')),
            ],
        ),
        migrations.AddField(
            model_name='audio',
            name='playlist_name',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='notesystem.playlist'),
        ),
    ]
