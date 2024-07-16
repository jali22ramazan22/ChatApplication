import json
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.exceptions import ParseError, APIException
from .models import *
from django.db.models import Q
from .utils.parseJWT import parse_token


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


class Chats(APIView):
    def get(self, request):
        user = parse_token(request, 'HTTP')  #importing the util to get the user id based on JWT AUTH
        conversations, companions = get_companions_of_related_chats(user)

        data = []

        for conversation in conversations:
            messages = Message.objects.filter(conversation_id=conversation)
            message_lst = [
                {
                    "from": message.from_user.username,
                    "message": message.message_text
                }
                for message in messages]

            companion = companions.filter(conversation_id=conversation).first()
            if companion:
                item = {
                    "conversation": conversation.conversation_name,
                    "companion": companion.user_member.username,
                    'message': message_lst
                }
                data.append(item)

        return Response(data={"chats": data}, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_users(request):
    user = parse_token(request, connection_protocol='HTTP')
    conversations, companions = get_companions_of_related_chats(user)

    users_to_exclude = [user.id]
    for companion in companions:
        users_to_exclude.append(companion.user_member.id)

    all_users = User.objects.exclude(id__in=users_to_exclude)
    users_data = [{"id": user.id, "username": user.username} for user in all_users]

    return Response(data={"users": users_data}, status=status.HTTP_200_OK)


@api_view(['PUT'])
def create_new_chat(request):
    user = parse_token(request, connection_protocol='HTTP')

    try:
        data = json.loads(request.body.decode('utf-8'))
    except json.JSONDecodeError:
        raise ParseError('Invalid data format')

    if 'user' not in data:
        raise ParseError('User to add is required')

    user_to_add_username = data['user']['username']

    try:
        user_to_add = User.objects.get(username=user_to_add_username)
    except User.DoesNotExist:
        raise ParseError('User to add does not exist')

    conversation_name = f'{user.username}_{user_to_add.username}'
    print(conversation_name)

    if not Conversation.objects.filter(conversation_name=conversation_name).exists():
        new_conversation = Conversation(conversation_name=conversation_name)
        new_conversation.save()

        user_member_1 = GroupMember(user_member=user, conversation_id=new_conversation)
        user_member_2 = GroupMember(user_member=user_to_add, conversation_id=new_conversation)

        user_member_1.save()
        user_member_2.save()
    else:
        raise APIException('The conversation with this name already exists')

    return Response(data={"status": "success"}, status=status.HTTP_200_OK)


@api_view(['DELETE'])
def delete_chat(request):
    user = parse_token(request, connection_protocol='HTTP')

    try:
        data = json.loads(request.body.decode('utf-8'))
    except json.JSONDecodeError:
        raise ParseError('Not valid data or just not attached it')

    if 'conversation' not in data:
        raise ParseError('Conversation field is required')

    conversation_to_delete = data['conversation']
    target_db_conversation = Conversation.objects.filter(conversation_name=conversation_to_delete).first()

    if not target_db_conversation:
        return Response({"detail": "Conversation not found"}, status=status.HTTP_404_NOT_FOUND)

    user_member_1 = GroupMember.objects.filter(user_member=user, conversation_id=target_db_conversation).first()

    if user_member_1:
        user_member_1.delete()

    user_member_2 = GroupMember.objects.filter(conversation_id=target_db_conversation).exclude(user_member=user).first()

    if user_member_2:
        user_member_2.delete()

    return Response({"detail": "Chat deleted"}, status=status.HTTP_204_NO_CONTENT)
