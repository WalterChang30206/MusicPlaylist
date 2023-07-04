from django.shortcuts import render , get_object_or_404
from django.http import HttpResponse , JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import PlaylistSerializer , AudioSerializer
import re

from .third_party_api import get_youtube_json
from .models import User , Playlist , Audio , Pointmark , Sectionmark

import os
from dotenv import load_dotenv
load_dotenv()


@api_view(['GET'])
def access_id_get(request):

    client_id = str(os.environ.get('CLIENT_ID'))
    response_json = {"client_id":client_id}

    return Response(response_json)


@api_view(['GET','POST',])
def library_get(request,user_email):
    
    if request.method == 'GET':

        try:
            User.objects.get(user_email = user_email)
        except User.DoesNotExist:
            User.objects.create(user_email = user_email)

        lib_list = Playlist.objects.filter(user_email__user_email=user_email)
        serializer = PlaylistSerializer(lib_list, many=True)

        return Response(serializer.data)

    if request.method == 'POST':

        playlist_name = request.data['playlist_name']
        try:
            Playlist.objects.get(playlist_name = playlist_name)
        except Playlist.DoesNotExist:

            user_email_object = User.objects.get(user_email=user_email)
            user_email_id = user_email_object.id
            playlist_object = Playlist.objects.create(playlist_name = playlist_name , user_email_id = user_email_id)
            serializer = PlaylistSerializer(playlist_object , many=False)

            return Response(serializer.data)

        # if serializer.is_valid():
        #     serializer.save()

        # 像前兩行的 is_valid() 必須要配合 Serializer( data = ... ) 來使用
        # 另外，我之前得到的 error 還有 object is not iterable，其實這跟 many = True / False 有關，True 代表要餵 list object，然後會 traverse 裡面每一個，Model.objects.filter() 會回傳 list
        # 而 Models.objects.get() 則是會回傳單一一個物件，所以如果是用 get 的話，many 就是要等於 False

        



@api_view(['PUT','DELETE'])
def library_ud(request,id):

    if request.method == 'PUT':
    
        data = request.data
        upd_playlist = Playlist.objects.get(id=id)

        serializer = PlaylistSerializer(instance=upd_playlist, data=data)

        if serializer.is_valid():
            serializer.save()

        return Response(serializer.data)

    if request.method == 'DELETE':

        del_playlist = Playlist.objects.get(id=id)
        del_playlist.delete()

        return Response('This playlist has been deleted')

@api_view(['GET','POST'])
def music_item_get(request):

    if request.method == 'GET':
    
        # 嘗試從 url 上面 ?playlist_name=' ' 這邊取得用來 filter 的 key
        target_playlist_name = request.GET.get('playlist_name')
        music_items = Audio.objects.filter(playlist_name__playlist_name=target_playlist_name)
        serializer = AudioSerializer(music_items , many=True)
            

        return Response(serializer.data)

    if request.method == 'POST':

        # 確保我們把影片加進正確的 playlist 裡面
        cur_playlist = request.data['playlist_name']
        cur_playlist_obj = Playlist.objects.get(playlist_name=cur_playlist)
        cur_playlist_id = cur_playlist_obj.id

        # 從前端那裡傳過來的 url 有兩種，一個是純粹後面帶
        audio_urls_all = request.data['audio_urls']
        audio_urls = audio_urls_all.split('&')[0]

        regex = re.compile(r"(www.youtube.com\/watch\?v=)(.+&)")
        m = regex.search(audio_urls_all)
        video_id = m.group(2).split('&')[0]

        yt_json = get_youtube_json(video_id)
        audio_name = yt_json['items'][0]['snippet']['title']

        audio = Audio.objects.create( playlist_name_id=cur_playlist_id, audio_urls=audio_urls, audio_name=audio_name )

        serializer = AudioSerializer(audio)
        # if serializer.is_valid():
        #     serializer.save()

        return Response(serializer.data)  


@api_view(['DELETE'])
def music_item_del(request, id):

    if request.method == 'DELETE':

        del_music_item = Audio.objects.get(id=id)
        del_music_item.delete()

        return Response('This music item has been deleted')
    

# @api_view(['GET'])
# def yt_data_get(request):
# 
#         yt_json = get_youtube_json()
#         
#         return HttpResponse(yt_json['items'][0]['snippet']['title'])
