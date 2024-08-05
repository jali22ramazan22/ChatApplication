from rest_framework import status
from rest_framework.response import Response
from django.contrib.auth.models import User

from chat.serializers import UserModelSerializer
from .serializers import UserSerializer
from rest_framework.exceptions import AuthenticationFailed
import jwt, datetime
from .settings import SECRET_KEY
from rest_framework.decorators import api_view
from django.core.cache import cache
from .serializers import UserCacheSerializer


#TODO: add refresh token arhitecture to auth app
@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        raise AuthenticationFailed('User not found')

    if not user.check_password(password):
        raise AuthenticationFailed('Incorrect password')

    payload = {
        'id': user.id,
        'exp': datetime.datetime.now() + datetime.timedelta(days=1),
        'iat': datetime.datetime.now()
    }

    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256').encode('utf-8')

    cache_data = {
        "user": UserModelSerializer(user).data,
        "payload": token
    }
    # serializer = UserCacheSerializer(data=cache_data)
    # if serializer.is_valid():
    #     serializer.save()
    #
    # cache.set("FROM_DJANGO", "TRUE")

    return Response({
        "token": token,
        'username': username
    })


@api_view(['POST'])
def register_view(request):
    serializer = UserSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    user = serializer.save()
    user.set_password(request.data['password'])
    user.save()

    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def logout_view(request):
    return Response(
        data={'message': 'Logged out successfully'},
        status=status.HTTP_200_OK
    )
