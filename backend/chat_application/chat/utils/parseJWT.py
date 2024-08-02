from rest_framework.exceptions import AuthenticationFailed
import jwt
from django.conf import settings
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from urllib import parse
import json
from chat_application.serializers import UserSerializer


#The function aimed to parse the token within the request obtained from user
# The specification '*' is for explicit calling the argument 'connection_protocol' like
# -> parse_token(arg1, connection_protocol="HTTP")
def parse_token(attached_data=None, *, connection_protocol='HTTP'):
    if not attached_data:
        raise Exception('No data to get attached token')
    token = None

    if connection_protocol == 'HTTP':
        token = attached_data.headers.get('Authorization')
    elif connection_protocol == 'WS':
        try:
            token = parse.parse_qs(attached_data, ).get('token', [None])[0]
        except json.JSONDecodeError:
            raise AuthenticationFailed('Invalid JSON data for WebSocket')

    if not token:
        print('The token is not provided')
        raise AuthenticationFailed('Unauthenticated')

    if not token.startswith('Bearer '):
        raise AuthenticationFailed("Invalid token format")

    try:
        token = token.split()[1]
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed('Unauthenticated')

    return get_object_or_404(User, id=payload['id'])


#the function that parses bytes obtained also from the user to assign the chat name to channel layer
#in a websocket consumer
#from a query string that is glued in websocket connection
def parse_chat(attached_data=None):
    if not attached_data:
        return None
    return parse.parse_qs(attached_data, ).get('chat', [None])[0]
