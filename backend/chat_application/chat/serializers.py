from rest_framework import serializers, viewsets
from .models import Message, Conversation, GroupMember
from django.contrib.auth.models import User


class MessageModelSerializer(serializers.ModelSerializer):
    from_user = serializers.CharField(source='from_user.username', read_only=True)

    class Meta:
        model = Message
        fields = ['from_user', 'message_text']


class UserModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']
