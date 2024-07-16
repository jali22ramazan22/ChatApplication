from django.contrib import admin
from django.urls import re_path, path
from . import views
urlpatterns = [
    path('chats/', views.Chats.as_view(), name='chats'),
    path('get_users/', views.get_users, name='get_users'),
    path('create_new_user', views.create_new_chat, name='create_new_user')
]