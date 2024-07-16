from django.urls import re_path
from .consumers import ChatConsumer
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/chats/', consumers.ChatConsumer.as_asgi()),
]