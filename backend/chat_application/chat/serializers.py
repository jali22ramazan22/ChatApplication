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

    #temporarily written to for pretending 'constant invalidation'
    def validate(self, attrs):
        if 'conversation' in attrs:
            attrs['conversation_name'] = attrs.pop('conversation')
        return attrs

    def validate_conversation_name(self, value):
        if Conversation.objects.filter(conversation_name=value).exists():
            raise ValidationError('This conversation already exists')
        return value
