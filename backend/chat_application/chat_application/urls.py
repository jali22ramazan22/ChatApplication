from django.contrib import admin
from django.urls import re_path, include
from . import views
urlpatterns = [
    re_path('login', views.login_view),
    re_path('signup', views.register_view),
    re_path('logout', views.logout_view),
    re_path('', include('chat.urls')),
    re_path('admin', admin.site.urls)
]
