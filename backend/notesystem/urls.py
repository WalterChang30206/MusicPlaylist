from django.urls import path

from . import views

urlpatterns = [
    path('client_id/',views.access_id_get, name='access_id_get'),
    path('library/<str:user_email>/',views.library_get, name='library_get'),
    path('library/upd_del/<int:id>/',views.library_ud, name='library_ud'),
    path('music_item/get/',views.music_item_get, name='music_item_get'),
    path('music_item/del/<int:id>/',views.music_item_del, name='music_item_del'),
    path('yt_test/',views.yt_data_get, name='yt_data_get'),
]

    # path('<int:video_id>/',views.note, name='note'),
    # path('<int:video_id>/<library_name>/',views.note_detail, name='note'),