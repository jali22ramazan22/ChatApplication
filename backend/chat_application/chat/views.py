import json
import logging
import django.db.models
import rest_framework.serializers
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ParseError, APIException
from .models import *
from .serializers import MessageModelSerializer, UserModelSerializer, ConversationSerializer
from django.db.models import Q
from .utils.parseJWT import parse_token
from .utils.timeit import timing


# All function-based views that require
# the JWT token to get user-id and
# make a query to database via it
@timing
def get_companions_of_related_chats(user_owner=None):
    if not user_owner:
        return None

    chats = GroupMember.objects.filter(user_member=user_owner)
    conversations = [chat.conversation_id for chat in chats]

    # processing filter to get another companions from the same chats
    companions = GroupMember.objects.filter(
        Q(conversation_id__in=conversations) & ~Q(user_member=user_owner)
    )

    return conversations, companions


#the function-based view that returns all chats of related user
#filtering all chats to return as API
@timing
@api_view(['GET'])
def get_chats(request):
    user = parse_token(request, connection_protocol='HTTP')  # importing the util to get the user id based on JWT AUTH

    conversations, companions = get_companions_of_related_chats(user)

    data = []

    for conversation in conversations:
        messages = Message.objects.filter(conversation_id=conversation)
        serializer = MessageModelSerializer(messages, many=True)
        message_lst = serializer.data
        companion = companions.filter(conversation_id=conversation).first()
        if companion:
            item = {
                "conversation": conversation.conversation_name,
                "companion": companion.user_member.username,
                'message': message_lst
            }
            data.append(item)

    return Response(data={"chats": data}, status=status.HTTP_200_OK)


#the function-based view that returns all users that is not in conversation with request-user
@timing
@api_view(['GET'])
def get_users(request):
    user = parse_token(request, connection_protocol='HTTP')
    conversations, companions = get_companions_of_related_chats(user)

    users_to_exclude = [user.id]
    for companion in companions:
        users_to_exclude.append(companion.user_member.id)

    all_users = User.objects.exclude(id__in=users_to_exclude)
    user_serializer = UserModelSerializer(all_users, many=True)

    return Response(data={"users": user_serializer.data}, status=status.HTTP_200_OK)

#TODO: rewrite the frontend request for excluding additional dict forming logic and
# just transmit the dict from 'data' to serializer
#TODO: write the ModelViewSet that hides the GroupMember CRUD operations
@timing
@api_view(['PUT'])
def create_new_chat(request):
    user = parse_token(request, connection_protocol='HTTP')

    try:
        data = json.loads(request.body.decode('utf-8'))
        if 'user' not in data:
            raise APIException('User to add is required')
        user_to_add = User.objects.get(username=data['user']['username'])

    except json.JSONDecodeError or User.DoesNotExist:
        raise APIException('Invalid data format')

    conversation_name = f'{user.username}_{user_to_add.username}'
    serializer = ConversationSerializer(data={'conversation_name': conversation_name})
    if not serializer.is_valid():
        return APIException(serializer.errors)
    new_conversation = serializer.save()

    user_member_1 = GroupMember(user_member=user, conversation_id=new_conversation)
    user_member_2 = GroupMember(user_member=user_to_add, conversation_id=new_conversation)

    user_member_1.save(), user_member_2.save()

    return Response(data={"status": "success"}, status=status.HTTP_200_OK)


@timing
@api_view(['DELETE'])
def delete_chat(request):
    user = parse_token(request, connection_protocol='HTTP')

    try:
        data = json.loads(request.body.decode('utf-8'))
    except json.JSONDecodeError:
        raise ParseError('Not valid data or just not attached it')

    if 'conversation' not in data:
        raise ParseError('Conversation field is required')

    conversation_name = data['conversation']
    target_db_conversation = Conversation.objects.filter(conversation_name=conversation_name).first()

    if not target_db_conversation:
        return Response({"detail": "Conversation not found"}, status=status.HTTP_404_NOT_FOUND)

    GroupMember.objects.filter(conversation_id=target_db_conversation).delete()

    return Response({"detail": "Chat deleted"}, status=status.HTTP_204_NO_CONTENT)
