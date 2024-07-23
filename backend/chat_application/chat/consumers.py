from asgiref.sync import sync_to_async, async_to_sync
from channels.generic.websocket import WebsocketConsumer
import json
from .models import Message, GroupMember, Conversation
from chat.utils.parseJWT import parse_token, parse_chat
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


class ChatConsumer(WebsocketConsumer):
    connected_users = {}
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.user = None
        self.chat = None

    def connect(self):
        self.accept()
        try:
            decoded_query_data = self.scope['query_string'].decode('utf-8')
            self.chat = parse_chat(decoded_query_data)
            self.user = parse_token(decoded_query_data, connection_protocol='WS')

            if not self.user or not self.chat:
                self.close()
                return

            print(f'Connected user: {self.user}, chat: {self.chat}')

            async_to_sync(self.channel_layer.group_add)(
                self.chat,
                self.channel_name,
            )
            if self.chat not in ChatConsumer.connected_users:
                ChatConsumer.connected_users[self.chat] = []
            ChatConsumer.connected_users[self.chat].append(self.user.username)
            self.user_status('online')
            self.send_all_user_statuses()
        except Exception as e:
            logger.error(f"Error during authentication: {e}")
            self.close()

    def disconnect(self, close_code):
        self.user_status('offline')
        async_to_sync(self.channel_layer.group_discard)(
            self.chat,
            self.channel_name
        )
        if self.chat in ChatConsumer.connected_users:
            ChatConsumer.connected_users[self.chat].remove(self.user.username)
            if not ChatConsumer.connected_users[self.chat]:
                del ChatConsumer.connected_users[self.chat]
        self.close()

    def send_all_user_statuses(self):
        if self.chat in ChatConsumer.connected_users:
            for username in ChatConsumer.connected_users[self.chat]:
                self.send(text_data=json.dumps({
                    'type': 'user_status',
                    'user': username,
                    'status': 'online'
                }))

    def attach_message_to_conversation(self, parsed_data, user):
        conversation = Conversation.objects.filter(conversation_name=self.chat).first()
        if not conversation:
            print(f"Conversation not found: {self.chat}")
            raise ValueError(f"Conversation not found: {self.chat}")

        attach_message = Message(
            from_user=user,
            message_text=parsed_data['message'],
            conversation_id=conversation,
            sent_datetime=datetime.now()
        )
        attach_message.save()
        async_to_sync(self.channel_layer.group_send)(
            self.chat,
            {
                'type': 'chat_message',
                'from': user.username,
                'message': parsed_data['message']
            }
        )

    def receive(self, text_data=None, bytes_data=None):
        if not text_data:
            logger.error("Empty text data received")
            self.send(text_data=json.dumps({'status': 'error', 'message': 'Empty text data received'}))
            return
        try:
            parsed_data = json.loads(text_data)
            print(parsed_data)
            if 'typing' in parsed_data:
                self.send_typing_status(parsed_data['typing'])

            elif parsed_data.get('message', '') != '':
                self.attach_message_to_conversation(parsed_data, self.user)
                self.send(text_data=json.dumps({'status': 'success', 'data': parsed_data}))
            else:
                logger.error("Invalid message format")
                self.send(text_data=json.dumps({'status': 'error', 'message': 'Invalid message format'}))
        except Exception as e:
            logger.error(f"Error processing message: {e}")
            self.close()

    def chat_message(self, event):
        message = event['message']
        from_user = event['from']
        self.send(text_data=json.dumps({
            'type': 'chat_message',
            'from': from_user,
            'message': message
        }))

    def user_status(self, status):
        if self.user:
            async_to_sync(self.channel_layer.group_send)(
                self.chat,
                {
                    'type': 'user_status_message',
                    'user': self.user.username,
                    'status': status
                }
            )

    def user_status_message(self, event):
        user = event['user']
        status = event['status']
        self.send(text_data=json.dumps({
            'type': 'user_status',
            'user': user,
            'status': status
        }))

    def send_typing_status(self, typing_data):
        if not typing_data:
            return
        async_to_sync(self.channel_layer.group_send)(
            self.chat,
            {
                'type': 'user_typing',
                'user': typing_data['user'],
                'typing': typing_data['typing']
            }
        )

    def user_typing(self, event):
        user = event['user']

        #removing the collision between sender of event and mapping the 'typing' status
        if user == self.user.username:
            return

        typing = event['typing']
        self.send(text_data=json.dumps({
            'type': 'send_typing_status',
            'user': user,
            'typing': typing
        }))
