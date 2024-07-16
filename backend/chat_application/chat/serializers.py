from rest_framework import serializers
from .models import GroupMember, Message, Conversation


class ChatsSerializer(serializers.Serializer):
    conversation_id = serializers.CharField()
    user_member = serializers.CharField()

    class Meta:
        model = GroupMember
        fields = ['conversation_name', 'user']


class ConversationSerializer(serializers.Serializer):
    conversation_name = serializers.CharField()

    class Meta:
        model = Conversation
        fields = ['conversation_name']
