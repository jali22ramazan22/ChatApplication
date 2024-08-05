from rest_framework import serializers, viewsets
from .models import Message, Conversation, GroupMember
from django.contrib.auth.models import User
from rest_framework.exceptions import ValidationError


class MessageModelSerializer(serializers.ModelSerializer):
    from_user = serializers.CharField(source='from_user.username', read_only=True)

    class Meta:
        model = Message
        fields = ['from_user', 'message_text']


class UserModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']


class ConversationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conversation
        fields = ['conversation_name']

    def create(self, validated_data):
        return Conversation.objects.create(**validated_data)

    def to_internal_value(self, data):
        if 'conversation' in data and isinstance(data, dict):
            data['conversation_name'] = data.pop('conversation')
        return super().to_internal_value(data)

    def validate_conversation_name(self, value):
        if Conversation.objects.filter(conversation_name=value).exists():
            raise ValidationError('This conversation already exists')
        return value
