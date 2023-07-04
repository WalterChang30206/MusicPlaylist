from django.contrib import admin
from .models import User , Playlist , Audio , Pointmark , Sectionmark

admin.site.register(User)
admin.site.register(Playlist)
admin.site.register(Audio)
admin.site.register(Pointmark)
admin.site.register(Sectionmark)
