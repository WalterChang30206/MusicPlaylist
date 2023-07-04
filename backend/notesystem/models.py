from django.db import models

class User(models.Model):

    user_email = models.EmailField(max_length=50,default='visitor@audionote.com')

    def __str__(self):
        return 'user' + str(self.pk)


class Playlist(models.Model):

    user_email = models.ForeignKey(User,on_delete=models.CASCADE,null=True)
    playlist_name = models.CharField(max_length=50)
    
    def __str__(self):
        return self.playlist_name
    

class Audio(models.Model):
    
    playlist_name = models.ForeignKey(Playlist, on_delete= models.CASCADE)
    audio_urls = models.URLField()  # using the video url for the primary key
    audio_name = models.CharField(max_length=90, null=True)

    def __str__(self):
        return self.audio_name
        

class Pointmark(models.Model):

    # audio_id is our parent, and other informations would be children.
    audio_id = models.ForeignKey(Audio, null=True, on_delete= models.CASCADE)

    # 時間戳紀
    point = models.IntegerField()

    # 對應於該時間戳記的文字段落
    text = models.TextField(blank=True, default= '')

class Sectionmark(models.Model):

    # 與前一個的邏輯類似，但這邊因為要選取一段範圍，所以會有兩個時間點
    audio_id = models.ForeignKey(Audio, null=True, on_delete= models.CASCADE)
    start = models.IntegerField()
    end = models.IntegerField()
    text = models.TextField(blank=True, default= '')