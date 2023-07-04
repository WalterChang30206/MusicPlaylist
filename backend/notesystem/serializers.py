from rest_framework.serializers import ModelSerializer
from .models import Playlist , Audio


class PlaylistSerializer(ModelSerializer):
    class Meta:
        model = Playlist
        fields = '__all__'


class AudioSerializer(ModelSerializer):
    class Meta:
        model = Audio
        fields = '__all__'