from rest_framework import serializers
from .models import GroupMember, Message, Conversation
from rest_framework.renderers import JSONRenderer

class MessageSerializer(serializers.ModelSerializer):
    from_user = serializers.CharField()
    message_text = serializers.CharField()
    sent_datetime = serializers.DateField()
    conversation_id = serializers.IntegerField()

    class Meta:
        model = Message
        fields = ['from_user', 'message_text', 'sent_datetime', 'conversation_id']

